import mongoose, { model } from "mongoose"

const transactionSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Girls',
        required: true
    },
    coinAmount: {
        type: Number,
    },
    roomId: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;