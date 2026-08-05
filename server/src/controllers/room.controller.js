import { v4 as uuidv4 } from 'uuid';
import Room from '../models/room.model.js';
import Message from '../models/message.model.js';
import VisitHistory from '../models/visitHistory.model.js';
import { deleteFromImageKit } from '../utils/imageKit.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from '../utils/apiError.js';
import { io } from '../socket/socket.js';
import mongoose from 'mongoose';
import { respactPointCalculate } from '../utils/respactPointCalculate.js';
import { userRateCalculate } from '../utils/calculateUserRateAVG.js';
import { moneyTransfer, calculateMiliScond } from '../utils/calculation.js'
import User from '../models/user.model.js';

const ALLOWED_LANGUAGES = ['Bengali', 'Hindi', 'Gujarati', 'English', 'Kannada', 'Marathi', 'Tamil', 'Telugu', 'Urdu', 'Punjabi'];
const MINIMUM_JOIN_COINS = { message: 5, voice: 10 };
const activeRoomTimers = new Map();

const clearRoomTimer = (roomId) => {
    const timer = activeRoomTimers.get(roomId);
    if (timer) {
        clearTimeout(timer);
        activeRoomTimers.delete(roomId);
    }
};

const getSessionDurationSeconds = (room, leftAt = new Date()) => (
    room.currentBoyJoinedAt
        ? Math.max(0, Math.round((leftAt - room.currentBoyJoinedAt) / 1000))
        : 0
);

const createVisitHistory = async (room, boyId, exitReason, leftAt = new Date()) => {
    const durationSeconds = getSessionDurationSeconds(room, leftAt);

    await VisitHistory.create({
        roomId: room.roomId,
        girl: room.createdBy,
        boy: boyId,
        roomType: room.roomType,
        joinedAt: room.currentBoyJoinedAt || leftAt,
        leftAt,
        durationSeconds,
        exitReason
    });

    return { durationSeconds };
};

const processSessionPayment = async (room, boyId, durationSeconds) => {
    const paymentClaim = await Room.collection.updateOne(
        {
            _id: room._id,
            currentBoy: new mongoose.Types.ObjectId(boyId),
            $or: [
                { currentSessionPaymentStatus: 'pending' },
                { currentSessionPaymentStatus: { $exists: false } },
                { currentSessionPaymentStatus: null }
            ]
        },
        { $set: { currentSessionPaymentStatus: 'processing' } }
    );

    if (paymentClaim.modifiedCount !== 1) {
        const currentRoom = await Room.collection.findOne(
            { _id: room._id },
            { projection: { currentSessionPaymentStatus: 1 } }
        );

        return currentRoom?.currentSessionPaymentStatus === 'settled'
            ? 'already_settled'
            : 'processing';
    }

    try {
        await moneyTransfer(boyId, room.createdBy, durationSeconds, room.roomType);
    } catch (error) {
        await Room.collection.updateOne(
            { _id: room._id, currentSessionPaymentStatus: 'processing' },
            { $set: { currentSessionPaymentStatus: 'pending' } }
        );
        throw error;
    }

    await Room.collection.updateOne(
        { _id: room._id, currentSessionPaymentStatus: 'processing' },
        { $set: { currentSessionPaymentStatus: 'settled' } }
    );
    return 'settled';
};

const completeBoySession = async (room, boyId, exitReason) => {
    const roomId = room.roomId;
    const leftAt = new Date();
    const durationSeconds = getSessionDurationSeconds(room, leftAt);

    const paymentStatus = await processSessionPayment(room, boyId, durationSeconds);
    if (paymentStatus !== 'settled') {
        return { durationSeconds, alreadyFinalizing: true };
    }

    await createVisitHistory(room, boyId, exitReason, leftAt);

    clearRoomTimer(roomId);

    room.status = 'open';
    room.currentBoy = null;
    room.currentBoyJoinedAt = null;
    room.currentSessionDurationMs = null;
    await room.save();

    await Message.deleteMany({ roomId });

    io.to(roomId).emit('boy_left', {
        roomId,
        boyId,
        durationSeconds,
        exitReason
    });
    io.emit('room_available', { roomId });

    return { durationSeconds };
};

// Used by both the authenticated destroy endpoint and socket disconnects so a
// host leaving unexpectedly follows the exact same room cleanup flow.
const destroyRoomInternally = async (room, message = 'The room has been destroyed by the host') => {
    const roomId = room.roomId;

    const mediaMessages = await Message.find({
        roomId,
        messageType: { $in: ['image', 'audio'] },
        fileId: { $ne: null }
    });

    for (const msg of mediaMessages) {
        try {
            await deleteFromImageKit(msg.fileId);
        } catch (error) {
            console.error(`ImageKit delete failed for fileId=${msg.fileId}:`, error.message);
        }
    }

    if (room.currentBoy) {
        const leftAt = new Date();
        const durationSeconds = getSessionDurationSeconds(room, leftAt);
        const paymentStatus = await processSessionPayment(room, room.currentBoy, durationSeconds);

        if (paymentStatus === 'processing') {
            throw new ApiError(409, 'The room session is being finalized. Please try again shortly.');
        }

        if (paymentStatus === 'settled') {
            await createVisitHistory(room, room.currentBoy, 'room_destroyed', leftAt);
            io.to(room.currentBoy.toString()).emit('room_destroyed', { roomId, message });
        }
    }

    await Message.deleteMany({ roomId });
    await Room.deleteOne({ _id: room._id });
    clearRoomTimer(roomId);
    io.emit('room_closed', { roomId });
};

// Called by the socket server after it has confirmed this is the user's last
// active connection. This deliberately uses the normal session lifecycle.
const handleParticipantOffline = async (userId, userType) => {
    if (userType === 'boy') {
        const room = await Room.findOne({ currentBoy: userId, status: 'occupied' });
        if (room) await completeBoySession(room, userId, 'boy_left');
        return;
    }

    if (userType === 'girl') {
        const room = await Room.findOne({
            createdBy: userId,
            status: { $in: ['open', 'occupied'] }
        });
        if (room) await destroyRoomInternally(room, 'The room host went offline');
    }
};

const scheduleBoyAutoLeave = (roomId, boyId, durationMs) => {
    clearRoomTimer(roomId);

    const timer = setTimeout(async () => {
        try {
            const room = await Room.findOne({ roomId });
            if (!room || room.currentBoy?.toString() !== boyId.toString()) {
                return;
            }

            await completeBoySession(room, boyId, 'time_limit');
        } catch (error) {
            console.error(`Auto leave failed for roomId=${roomId}:`, error.message);
        }
    }, durationMs);

    activeRoomTimers.set(roomId, timer);
};

const getRoomsForList = (query) => Room.aggregate([
    { $match: query },
    {
        $lookup: {
            from: 'girls',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy'
        }
    },
    {
        $unwind: {
            path: '$createdBy',
        }
    },
    {
        $lookup: {
            from: "followers",
            let: { girlId: "$createdBy._id" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$following", "$$girlId"]
                        }
                    }
                },
                {
                    $count: "totalFollowers"
                }
            ],
            as: "followersData"
        }
    },
    {
        $addFields: {
            totalFollowers: {
                $ifNull: [
                    { $arrayElemAt: ["$followersData.totalFollowers", 0] },
                    0
                ]
            }
        }
    },
    {
        $project: {
            roomId: 1,
            roomType: 1,
            status: 1,
            currentBoy: 1,
            currentBoyJoinedAt: 1,
            currentSessionDurationMs: 1,
            language: 1,
            createdAt: 1,
            updatedAt: 1,
            totalFollowers: 1,
            createdBy: {
                _id: '$createdBy._id',
                fullName: '$createdBy.fullName',
                imageUrl: '$createdBy.imageUrl',
                age: '$createdBy.age'
            }
        }
    },
    { $sort: { createdAt: -1 } }
]);

const createRoom = asyncHandler(async (req, res) => {

    if (req.userType !== 'girl') {
        throw new ApiError(403, 'Only girls can create rooms');
    }

    const girlId = req.user._id;
    const { roomType, languages } = req.body;

    if (!roomType || !['message', 'voice', 'video'].includes(roomType)) {
        throw new ApiError(400, 'Invalid or missing roomType. Must be one of: message, voice, video');
    }

    if (!Array.isArray(languages) || languages.length !== 2) {
        throw new ApiError(400, 'Please select exactly 2 languages');
    }

    const selectedLanguages = [...new Set(languages.map((language) => String(language).trim()))];
    if (selectedLanguages.length !== 2 || selectedLanguages.some((language) => !ALLOWED_LANGUAGES.includes(language))) {
        throw new ApiError(400, `Invalid languages. Select exactly 2 from: ${ALLOWED_LANGUAGES.join(', ')}`);
    }

    const existing = await Room.findOne({
        createdBy: girlId,
        status: { $in: ['open', 'occupied'] }
    });
    if (existing) {
        throw new ApiError(400, 'You already have an active room. Please destroy it before creating a new one.');
    }

    const roomId = `room_${uuidv4()}`;

    const room = await Room.create({
        roomId,
        createdBy: girlId,
        roomType,
        language: selectedLanguages,
        status: 'open'
    });

    const [roomForList] = await getRoomsForList({ _id: room._id });

    io.emit('room_opened', { room: roomForList });

    return res.status(201).json(
        new ApiResponse(201, {
            roomId: room.roomId,
            roomType: room.roomType,
            languages: room.language,
            status: room.status,
            createdAt: room.createdAt
        }, 'Room created successfully')
    );

});


const destroyRoom = asyncHandler(async (req, res) => {

    if (req.userType !== 'girl') {
        throw new ApiError(403, 'Only the girl who created a room can destroy it');
    }

    const girlId = req.user._id;
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
        throw new ApiError(404, 'Room not found');
    }
    if (room.createdBy.toString() !== girlId.toString()) {
        throw new ApiError(403, 'You do not own this room');
    }
    if (room.status === 'destroyed') {
        throw new ApiError(400, 'Room is already destroyed');
    }

    await destroyRoomInternally(room);

    return res.status(200).json(
        new ApiResponse(200, null, 'Room destroyed successfully')
    );

});

const joinRoom = asyncHandler(async (req, res) => {

    if (req.userType !== 'boy') {
        throw new ApiError(403, 'Only boys can join rooms');
    }

    const boyId = req.user._id;
    const { roomId } = req.params;

    const existingBoyRoom = await Room.findOne({
        currentBoy: boyId,
        status: 'occupied'
    });
    if (existingBoyRoom) {
        throw new ApiError(409, 'You are already inside another room');
    }

    const roomToJoin = await Room.findOne({ roomId, status: 'open', currentBoy: null })
        .select('roomType');
    if (!roomToJoin) {
        const roomExists = await Room.exists({ roomId });
        if (!roomExists) throw new ApiError(404, 'Room not found');
        throw new ApiError(409, 'Room is currently occupied. Try again shortly.');
    }

    const minimumCoins = MINIMUM_JOIN_COINS[roomToJoin.roomType];
    if (minimumCoins) {
        const boy = await User.findById(boyId).select('walletBlance').lean();
        if (!boy || Number(boy.walletBlance || 0) < minimumCoins) {
            throw new ApiError(403, `You need at least ${minimumCoins} coins to join this room`);
        }
    }

    const boyDurationMs = await calculateMiliScond(boyId, roomToJoin.roomType);
    const sessionDurationMs = boyDurationMs;
    const joinedAt = new Date();
    const room = await Room.findOneAndUpdate(
        { roomId, status: 'open', currentBoy: null },
        {
            $set: {
                status: 'occupied',
                currentBoy: boyId,
                currentBoyJoinedAt: joinedAt,
                currentSessionDurationMs: sessionDurationMs
            }
        },
        { new: true }
    );
    if (!room) {
        const roomExists = await Room.exists({ roomId });
        if (!roomExists) throw new ApiError(404, 'Room not found');
        throw new ApiError(409, 'Room is currently occupied. Try again shortly.');
    }

    await Room.collection.updateOne(
        { _id: room._id, currentBoy: new mongoose.Types.ObjectId(boyId) },
        { $set: { currentSessionPaymentStatus: 'pending' } }
    );

    io.to(roomId).emit('boy_joined', {
        roomId,
        boyId,
        sessionDurationMs
    });
    io.emit('room_occupied', { roomId });

    scheduleBoyAutoLeave(roomId, boyId, sessionDurationMs);

    return res.status(200).json(
        new ApiResponse(200, {
            roomId: room.roomId,
            roomType: room.roomType,
            sessionDurationMs,
            sessionDurationSeconds: sessionDurationMs / 1000,
            joinedAt: room.currentBoyJoinedAt
        }, 'Joined room successfully')
    );


});

const leaveRoom = asyncHandler(async (req, res) => {

    if (req.userType !== 'boy') {
        throw new ApiError(403, 'Girls must destroy their room; they cannot leave it');
    }

    const boyId = req.user._id;
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
        throw new ApiError(404, 'Room not found');
    }
    if (!room.currentBoy || room.currentBoy.toString() !== boyId.toString()) {
        throw new ApiError(403, 'You are not in this room');
    }

    await completeBoySession(room, boyId, 'boy_left');

    return res.status(200).json(
        new ApiResponse(200, null, 'Left room successfully')
    );

});

const getRoomDetails = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const requesterId = new mongoose.Types.ObjectId(req.user._id);

    let [room] = await Room.aggregate([

        {
            $match: {
                roomId
            }
        },
        {
            $lookup: {
                from: 'girls',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy'
            }
        },
        {
            $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: false }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'currentBoy',
                foreignField: '_id',
                as: 'currentBoy'
            }
        },
        {
            $unwind: { path: '$currentBoy', preserveNullAndEmptyArrays: true }
        },
        {
            $lookup: {
                from: 'followers',
                let: { girlId: '$createdBy._id' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$following', '$$girlId'] } } },
                    { $count: 'count' }
                ],
                as: '_girlFollowers'
            }
        },
        {
            $lookup: {
                from: 'followers',
                let: { girlId: '$createdBy._id' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$follower', '$$girlId'] } } },
                    { $count: 'count' }
                ],
                as: '_girlFollowing'
            }
        },
        {
            $lookup: {
                from: 'followers',
                let: { boyId: { $ifNull: ['$currentBoy._id', null] } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $ne: ['$$boyId', null] },
                                    { $eq: ['$following', '$$boyId'] }
                                ]
                            }
                        }
                    },
                    { $count: 'count' }
                ],
                as: '_boyFollowers'
            }
        },
        {
            $lookup: {
                from: 'followers',
                let: { boyId: { $ifNull: ['$currentBoy._id', null] } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $ne: ['$$boyId', null] },
                                    { $eq: ['$follower', '$$boyId'] }
                                ]
                            }
                        }
                    },
                    { $count: 'count' }
                ],
                as: '_boyFollowing'
            }
        },
        {
            $lookup: {
                from: 'followers',
                let: {
                    boyId: { $ifNull: ['$currentBoy._id', null] },
                    girlId: '$createdBy._id'
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $ne: ['$$boyId', null] },
                                    { $eq: ['$follower', '$$boyId'] },
                                    { $eq: ['$following', '$$girlId'] }
                                ]
                            }
                        }
                    },
                    { $limit: 1 }
                ],
                as: '_boyFollowsGirl'
            }
        },
        {
            $lookup: {
                from: 'followers',
                let: {
                    girlId: '$createdBy._id',
                    boyId: { $ifNull: ['$currentBoy._id', null] }
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $ne: ['$$boyId', null] },
                                    { $eq: ['$follower', '$$girlId'] },
                                    { $eq: ['$following', '$$boyId'] }
                                ]
                            }
                        }
                    },
                    { $limit: 1 }
                ],
                as: '_girlFollowsBoy'
            }
        },
        {
            $project: {
                _id: 1,
                roomId: 1,
                roomType: 1,
                status: 1,
                language: 1,
                currentBoyJoinedAt: 1,
                currentSessionDurationMs: 1,
                createdAt: 1,
                updatedAt: 1,
                createdBy: {
                    _id: '$createdBy._id',
                    fullName: '$createdBy.fullName',
                    imageUrl: '$createdBy.imageUrl',
                    age: '$createdBy.age'
                },
                currentBoy: {
                    $cond: {
                        if: { $not: ['$currentBoy._id'] },
                        then: null,
                        else: {
                            _id: '$currentBoy._id',
                            fullName: '$currentBoy.fullName',
                            imageUrl: '$currentBoy.imageUrl',
                            walletBlance: '$currentBoy.walletBlance'
                        }
                    }
                },
                girlsExtraDetails: {
                    followerCount: {
                        $ifNull: [{ $arrayElemAt: ['$_girlFollowers.count', 0] }, 0]
                    },
                    followingCount: {
                        $ifNull: [{ $arrayElemAt: ['$_girlFollowing.count', 0] }, 0]
                    },
                    isFollowedByBoy: {
                        $cond: {
                            if: { $not: ['$currentBoy._id'] },
                            then: '$$REMOVE',
                            else: { $gt: [{ $size: '$_boyFollowsGirl' }, 0] }
                        }
                    },
                    // girlAvgRate:AvgRating
                },
                boyExtraDetails: {
                    $cond: {
                        if: { $not: ['$currentBoy._id'] },
                        then: null,
                        else: {
                            followerCount: {
                                $ifNull: [{ $arrayElemAt: ['$_boyFollowers.count', 0] }, 0]
                            },
                            followingCount: {
                                $ifNull: [{ $arrayElemAt: ['$_boyFollowing.count', 0] }, 0]
                            },
                            isFollowingGirl: { $gt: [{ $size: '$_boyFollowsGirl' }, 0] },
                            isFollowedByGirl: { $gt: [{ $size: '$_girlFollowsBoy' }, 0] },

                        }
                    }
                }
            }
        }
    ]);

    if (!room) {
        throw new ApiError(404, 'Room not found');
    }
    let RespactPoint = 0;
    if (room.currentBoy?._id) {
        RespactPoint = await respactPointCalculate(room.currentBoy?._id);

    }
    const RespectObj = {
        "RespactPoint": Number(RespactPoint) * 2
    }
    const AvgRating = await userRateCalculate(room.createdBy?._id)
    const AvgObj = {
        "AvgRating": AvgRating
    }

    const isOwner = room.createdBy?._id?.toString() === requesterId.toString();
    const isCurrentBoy = room.currentBoy?._id?.toString() === requesterId.toString();
    room = { ...room, ...RespectObj, ...AvgObj }
    console.log(room)

    if (!isOwner && !isCurrentBoy) {
        throw new ApiError(403, 'You are not a participant in this room');
    }

    return res.status(200).json(
        new ApiResponse(200, { room }, 'Room details retrieved successfully')
    );
});


const getOpenRooms = asyncHandler(async (req, res) => {

    const { type } = req.query; // optional filter: ?type=voice

    const query = { status: { $in: ['open', 'occupied'] } };
    if (type && ['message', 'voice', 'video'].includes(type)) {
        query.roomType = type;
    }

    const rooms = await getRoomsForList(query);

    return res.status(200).json(
        new ApiResponse(200, rooms, 'Active rooms retrieved successfully')
    );

});

const getRoomMessages = asyncHandler(async (req, res) => {

    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
        throw new ApiError(404, 'Room not found');
    }

    const messages = await Message.find({ roomId })
        .populate('sender', 'fullName imageUrl')
        .sort({ createdAt: 1 });

    return res.status(200).json(
        new ApiResponse(200, { messages }, 'Room messages retrieved successfully')
    );

});

const getGirlHistory = asyncHandler(async (req, res) => {
    const girlId = req.user._id;

    const history = await VisitHistory.find({ girl: girlId })
        .populate('boy', 'fullName imageUrl')
        .sort({ createdAt: -1 })
        .limit(50);

    return res.status(200).json(
        new ApiResponse(200, { history }, 'Girl visit history retrieved successfully')
    );

});

const getBoyHistory = asyncHandler(async (req, res) => {
    const boyId = req.user._id;

    const history = await VisitHistory.find({ boy: boyId })
        .populate('girl', 'fullName imageUrl')
        .sort({ createdAt: -1 })
        .limit(50);

    return res.status(200).json(
        new ApiResponse(200, { history }, 'Boy visit history retrieved successfully')
    );

});

export {
    createRoom,
    destroyRoom,
    joinRoom,
    leaveRoom,
    getRoomDetails,
    getOpenRooms,
    getRoomMessages,
    getGirlHistory,
    getBoyHistory,
    handleParticipantOffline
}
