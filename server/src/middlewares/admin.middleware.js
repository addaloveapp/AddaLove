import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";

const verifyAdmin = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.authToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(401, "Unauthorized")
    }

    const decoded = jwt.verify(token, process.env.JWT_SERECT);
    const adminId = decoded?.userId || decoded?._id

    const admin = await Admin.findById(adminId).select("-password");
    if (!admin) {
        throw new ApiError(401, "Unauthorized")
    }

    req.admin = admin
    next()
})

export { verifyAdmin }