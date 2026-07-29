import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from '../utils/apiError.js';
import Razorpay from 'razorpay'
import crypto from 'crypto'
import User from '../models/user.model.js';
import CoinTransaction from '../models/coinsTransaction.model.js';
import mongoose from 'mongoose';
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const creatCoinOrder = asyncHandler(async (req, res) => {
    const { amount, coins, bonus, currency = 'INR', receipt = 'receipt#1' } = req.body;
    console.log(amount);
    console.log(req.user)
    const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: receipt,
        notes: {
            coins: coins,
            userId: req.user._id.toString(),
            username: req.user.fullName,
            useremail: req.user.email,
            bonus: bonus
        }
    };

    const order = await razorpay.orders.create(options);
    console.log(order);
    return res.status(200).json(new ApiResponse(200, { order }, 'Oder created'))
})

const paymentVerify = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Generate expected signature
    const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (generated_signature === razorpay_signature) {
        // Signature is valid
        return res.status(200).json(new ApiResponse(200, null, 'Payment verified successfully'))

    } else {
        throw new ApiError(400, 'Invalid signature')
    }
})

const addMoneyToWallet = asyncHandler(async (req, res) => {
    const { userId, coins, bonus, amount, razorpay_payment_id, razorpay_order_id } = req.body;

    if (!userId || !coins || !amount || !razorpay_payment_id || !razorpay_order_id) {
        throw new ApiError(400, 'All data not found')
    }
    const nAmount = Number(amount);
    const nCoins = Number(coins);
    const nbonus = Number(bonus || 0);
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const newcointranscation = new CoinTransaction({
            userId,
            coins: nCoins,
            bonus: nbonus,
            razorpay_payment_id,
            razorpay_order_id,
            amount: nAmount / 100
        })
        await newcointranscation.save({ session });
        const totalCoin = Number(coins) + Number(bonus);
        await User.findByIdAndUpdate(userId, { $inc: { walletBlance: totalCoin } }, { new: true, session })

        const newuserdata = await User.findById(userId).session(session).lean();
        const newWlletBlance = newuserdata.walletBlance;
        await session.commitTransaction();
        return res.status(200).json(new ApiResponse(200, { newWlletBlance }, 'Transcation Process completed'));
    } catch (error) {
        await session.abortTransaction();
        throw new ApiError(400,"Internal server error ! Try again.");
    }finally{
        session.endSession();
    }
});

const coinTranscationHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const allTranscation = await CoinTransaction.find({ userId: userId }).lean();
    if (!allTranscation) {
        throw new ApiError(200, 'No transaction found.')
    }
    return res.status(200).json(new ApiResponse(200, { allTranscation }, 'transcation found'))

})
export { creatCoinOrder, paymentVerify, addMoneyToWallet, coinTranscationHistory }