import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from '../utils/apiError.js';
import Girls from '../models/girls.model.js';
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

const allRoomsOpens = asyncHandler(async (req, res) => {
    const allOpensRoomsData = await Room.find({});
    if (!allOpensRoomsData) {
        return res.status(200).json(new ApiResponse(200, null, "No opens room."))
    }
    return res.status(200).json(new ApiResponse(200, allOpensRoomsData, "All open room retrived."))
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

const createCertificate=asyncHandler(async(req,res)=>{
    const {fullName,email,position}=req.body;
    if (!fullName || !email || !position) {
        throw new ApiError(400, "All data are Required.")
    }
    const newCertificate= new Certificate({
        fullName,
        email,
        position
    })
    await newCertificate.save();
    return res.status(201).json(new ApiResponse(201,newCertificate._id," Certificate issue Successfully."))
})
const checkCertificate=asyncHandler(async(req,res)=>{
    const id = req.params.id;

    const certificateData = await Certificate.findById(id);
    if(!certificateData){
        throw new ApiError(404,"Certificate not found")
    }
    return res.status(200).json(new ApiResponse(200,certificateData,"Certificate found successful."))
})
export { allApplication, allRoomsOpens, allReport, allCoinPurchase ,registerAdmin,loginAdmin,logoutAdmin,createCertificate,checkCertificate };