import mongoose from "mongoose";

const withdrawRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Girls",
        required: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userPhoneNumber: {
        type: Number,
        required: true
    },
    userCoinBalance: {
        type: Number,
        required: true,
        default: 0
    },
    applicationId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    action: {
        type: String,
        enum: ["pending", "send"],
        default: "pending"
    },
    withdrawMethod: {
        type: String,
        enum: ["upi", "bank"],
        required: true
    },
    details: {
        upiId: {
            type: String,
            trim: true
        },
        accountNumber: {
            type: String,
            trim: true
        },
        ifscCode: {
            type: String,
            trim: true,
            uppercase: true
        }
    },
    withdrawAmount: {
        type: Number,
        required: true
    },
    coinValueForWithdraw: {
        type: Number,
        required: true
    },
    sentAt: {
        type: Date
    }
}, { timestamps: true });

const WithdrawRequest = mongoose.model("WithdrawRequest", withdrawRequestSchema);

export default WithdrawRequest;
