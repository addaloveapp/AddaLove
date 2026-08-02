import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from '../utils/apiError.js';
import Girls from '../models/girls.model.js';
import Room from '../models/room.model.js';
import Report from '../models/report.model.js';
import Transaction from '../models/transaction.model.js';
import CoinTransaction from '../models/coinsTransaction.model.js';


const allApplication=asyncHandler(async(req,res)=>{
    const allApplicationData = await Girls.find({})
    if(!allApplicationData){
        return res.status(200).json(new ApiResponse(200,null,"No application"))
    }
    return res.status(200).json(new ApiResponse(200,allApplicationData,"All application retrived."))
});

const allRoomsOpens= asyncHandler(async(req,res)=>{
    const allOpensRoomsData= await Room.find({});
    if(!allOpensRoomsData){
        return res.status(200).json(new ApiResponse(200,null,"No opens room."))
    }
    return res.status(200).json(new ApiResponse(200,allOpensRoomsData,"All open room retrived."))
});
const allReport = asyncHandler(async (req, res) => {
    const reports = await Report.aggregate([
        // Reported By (User)
        {
            $lookup: {
                from: "users",
                localField: "reportedBy",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            imageUrl: 1,
                            phoneNumber: 1
                        }
                    }
                ],
                as: "reportedByUser"
            }
        },

        // Reported By (Girls)
        {
            $lookup: {
                from: "girls",
                localField: "reportedBy",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            imageUrl: 1,
                            phoneNumber: 1
                        }
                    }
                ],
                as: "reportedByGirl"
            }
        },

        // Reported User (User)
        {
            $lookup: {
                from: "users",
                localField: "reportedUser",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            imageUrl: 1,
                            phoneNumber: 1
                        }
                    }
                ],
                as: "reportedUserUser"
            }
        },

        // Reported User (Girls)
        {
            $lookup: {
                from: "girls",
                localField: "reportedUser",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            imageUrl: 1,
                            phoneNumber: 1
                        }
                    }
                ],
                as: "reportedUserGirl"
            }
        },

        // Select the correct lookup result
        {
            $addFields: {
                reportedByDetails: {
                    $cond: [
                        { $eq: ["$userModel", "User"] },
                        { $arrayElemAt: ["$reportedByUser", 0] },
                        { $arrayElemAt: ["$reportedByGirl", 0] }
                    ]
                },
                reportedUserDetails: {
                    $cond: [
                        { $eq: ["$reportedUserModel", "User"] },
                        { $arrayElemAt: ["$reportedUserUser", 0] },
                        { $arrayElemAt: ["$reportedUserGirl", 0] }
                    ]
                }
            }
        },

        {
            $project: {
                reportedByUser: 0,
                reportedByGirl: 0,
                reportedUserUser: 0,
                reportedUserGirl: 0
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, reports, "All reports retrieved."));
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
export {allApplication,allRoomsOpens,allReport,allCoinPurchase};