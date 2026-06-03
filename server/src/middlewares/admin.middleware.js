import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Admin from "../models/company.model.js";
import jwt from "jsonwebtoken";

const verifyAdmin = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(401, "Unauthorized")
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const admin = await Admin.findById(decoded?._id).select("-password");
    if (!admin) {
        throw new ApiError(401, "Unauthorized")
    }

    req.admin = admin
    next()
})

export { verifyAdmin }