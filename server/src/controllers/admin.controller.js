import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from '../utils/apiError.js';
import Girls from '../models/girls.model.js';
import User from '../models/user.model.js';
import Room from '../models/room.model.js';
import Report from '../models/report.model.js';
import Transaction from '../models/transaction.model.js';
import CoinTransaction from '../models/coinsTransaction.model.js';
import Admin from '../models/admin.model.js';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { options } from '../constants.js';
import Certificate from '../models/certificate.model.js';
import mongoose from 'mongoose';
import sendaccpectemail from '../middlewares/sendAccpect.middleware.js';
import sendRejectemail from '../middlewares/sendReject.middleware.js';
import { getOnlineUsers } from '../socket/onlineUsers.js';
const registerAdmin = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        throw new ApiError(400, "All data are Required.")
    }
    const isHaveAccount = await Admin.findOne({ email });
    if (isHaveAccount) {
        throw new ApiError(400, "You already have an account.")
    }
    const slat = await bcrypt.genSalt(12);
    const haspass = await bcrypt.hash(password, slat);
    const newAdmin = new Admin({
        fullName,
        email,
        password: haspass

    })
    await newAdmin.save();
    return res.status(201).json(new ApiResponse(201, null, "New Admin register Successfully."))

});
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "All data are Required.")
    }
    const isHaveAccount = await Admin.findOne({ email });
    if (!isHaveAccount) {
        throw new ApiError(400, " Invalid credential.")
    }
    const varifyPassowrd = await bcrypt.compare(password, isHaveAccount?.password);
    if (!varifyPassowrd) {
        throw new ApiError(400, 'Invalid credential')
    }
    const authToken = jwt.sign({
        userId: isHaveAccount._id,
        phoneNumber: isHaveAccount.email,
        userType: "admin"
    }, process.env.JWT_SERECT);
    return res
        .status(200)
        .cookie("authToken", authToken, options)
        .json(
            new ApiResponse(200, { token: authToken }, "User logged in successfully")
        )

})
const logoutAdmin = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    res.clearCookie("authToken", options);
    return res.status(200).json(new ApiResponse(200, null, 'Logout done'))
})
const allApplication = asyncHandler(async (req, res) => {
    const allApplicationData = await Girls.find({})
    if (!allApplicationData) {
        return res.status(200).json(new ApiResponse(200, null, "No application"))
    }
    return res.status(200).json(new ApiResponse(200, allApplicationData, "All application retrived."))
});

const allBoysWithPresence = asyncHandler(async (req, res) => {
    const onlineBoyIds = new Set(
        getOnlineUsers()
            .filter((entry) => entry.userType === 'boy')
            .map((entry) => entry.userId)
    );

    const boys = await User.aggregate([
        {
            $lookup: {
                from: 'followers',
                let: { boyId: '$_id' },
                pipeline: [
                    { $match: { $expr: { $and: [
                        { $eq: ['$following', '$$boyId'] },
                        { $eq: ['$followingModel', 'User'] }
                    ] } } },
                    { $count: 'count' }
                ],
                as: 'followerData'
            }
        },
        {
            $lookup: {
                from: 'ratings',
                let: { boyId: '$_id' },
                pipeline: [
                    { $match: { $expr: { $and: [
                        { $eq: ['$ratedUser', '$$boyId'] },
                        { $eq: ['$ratedUserModel', 'User'] }
                    ] } } },
                    { $group: { _id: null, totalRating: { $sum: '$rating' } } }
                ],
                as: 'ratingData'
            }
        },
        {
            $project: {
                fullName: 1,
                imageUrl: 1,
                phoneNumber: 1,
                walletBlance: 1,
                followersCount: { $ifNull: [{ $arrayElemAt: ['$followerData.count', 0] }, 0] },
                respectPoints: { $multiply: [{ $ifNull: [{ $arrayElemAt: ['$ratingData.totalRating', 0] }, 0] }, 2] }
            }
        }
    ]);

    const profiles = boys
        .map((boy) => ({ ...boy, isOnline: onlineBoyIds.has(String(boy._id)) }))
        .sort((a, b) => Number(b.isOnline) - Number(a.isOnline) || a.fullName.localeCompare(b.fullName));

    return res.status(200).json(new ApiResponse(200, profiles, 'Boy profiles retrieved successfully'));
});

const allRoomsOpens = asyncHandler(async (req, res) => {
    const allOpensRoomsData = await Room.find({});
    if (!allOpensRoomsData) {
        return res.status(200).json(new ApiResponse(200, null, "No opens room."))
    }
    return res.status(200).json(new ApiResponse(200, allOpensRoomsData, "All open room retrived."))
});
const allReport = asyncHandler(async (req, res) => {
    const reports = await Report.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "reportedBy",
                foreignField: "_id",
                as: "reportedByUser"
            }
        },
        {
            $lookup: {
                from: "girls",
                localField: "reportedBy",
                foreignField: "_id",
                as: "reportedByGirl"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "reportedUser",
                foreignField: "_id",
                as: "reportedUserUser"
            }
        },
        {
            $lookup: {
                from: "girls",
                localField: "reportedUser",
                foreignField: "_id",
                as: "reportedUserGirl"
            }
        },
        {
            $addFields: {
                reportedByDetails: {
                    $ifNull: [
                        {
                            $cond: {
                                if: { $eq: ["$userModel", "User"] },
                                then: { $arrayElemAt: ["$reportedByUser", 0] },
                                else: { $arrayElemAt: ["$reportedByGirl", 0] }
                            }
                        },
                        {}
                    ]
                },
                reportedUserDetails: {
                    $ifNull: [
                        {
                            $cond: {
                                if: { $eq: ["$reportedUserModel", "User"] },
                                then: { $arrayElemAt: ["$reportedUserUser", 0] },
                                else: { $arrayElemAt: ["$reportedUserGirl", 0] }
                            }
                        },
                        {}
                    ]
                }
            }
        },
        {
            $project: {
                reason: 1,
                userModel: 1,
                reportedUserModel: 1,
                createdAt: 1,
                updatedAt: 1,

                "reportedByDetails._id": 1,
                "reportedByDetails.fullName": 1,
                "reportedByDetails.email": 1,
                "reportedByDetails.phoneNumber": 1,
                "reportedByDetails.imageUrl": 1,

                "reportedUserDetails._id": 1,
                "reportedUserDetails.fullName": 1,
                "reportedUserDetails.email": 1,
                "reportedUserDetails.phoneNumber": 1,
                "reportedUserDetails.imageUrl": 1
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]);

    if (!reports || reports.length === 0) {
        throw new ApiError(400, "All data are Required.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, reports, "Reports fetched Successfully."));
});

const allCoinPurchase = asyncHandler(async (req, res) => {
    const allCoinPurchaseData = await CoinTransaction.aggregate([
        {
            $lookup: {
                from: "users", // User collection
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            email: 1,
                            phoneNumber: 1,
                            walletBlance: 1
                        }
                    }
                ],
                as: "userDetails"
            }
        },
        {
            $addFields: {
                userDetails: {
                    $arrayElemAt: ["$userDetails", 0]
                }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, allCoinPurchaseData, "All data retrieved")
    );
});

const createCertificate = asyncHandler(async (req, res) => {
    const { fullName, email, position } = req.body;
    if (!fullName || !email || !position) {
        throw new ApiError(400, "All data are Required.")
    }
    const newCertificate = new Certificate({
        fullName,
        email,
        position
    })
    await newCertificate.save();
    return res.status(201).json(new ApiResponse(201, newCertificate._id, " Certificate issue Successfully."))
})
const checkCertificate = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const certificateData = await Certificate.findById(id);
    if (!certificateData) {
        throw new ApiError(404, "Certificate not found")
    }
    return res.status(200).json(new ApiResponse(200, certificateData, "Certificate found successful."))
});
const accpectTheGirls = asyncHandler(async (req, res) => {
    const { userID, email } = req.body;
    if (!userID || !email) {
        throw new ApiError(400, "All data Required.")
    }
    const girlsData = await Girls.findById(userID);
    if (!girlsData) {
        throw new ApiError(404, "Girl not found.")
    }
    const sendemail = await sendaccpectemail(email);
    await Girls.findByIdAndUpdate(userID, { $set: { applicationStatus: "accepted" } }, { new: true });
    return res.status(200).json(new ApiResponse(200, null, "Accpect the mail was send and account has been accpected."))


})
const rejectTheGirls = asyncHandler(async (req, res) => {
    const { userID, email } = req.body;
    if (!userID || !email) {
        throw new ApiError(400, "All data Required.")
    }
    const girlsData = await Girls.findById(userID);
    if (!girlsData) {
        throw new ApiError(404, "Girl not found.")
    }
    const sendemail = await sendRejectemail(email);
    await Girls.findByIdAndUpdate(userID, { $set: { applicationStatus: "rejected" } }, { new: true });
    return res.status(200).json(new ApiResponse(200, null, "Reject mail was send and account has been rejected."))


})
export { allApplication, allBoysWithPresence, allRoomsOpens, allReport, allCoinPurchase, registerAdmin, loginAdmin, logoutAdmin, createCertificate, checkCertificate, accpectTheGirls, rejectTheGirls };
