import mongoose from "mongoose";
import User from "../models/user.model.js";
import Girls from "../models/girls.model.js";
import Transaction from "../models/transaction.model.js";

const calculateMiliScond = async (userId, roomType) => {
    const mongoId = new mongoose.Types.ObjectId(userId);

    const user = await User.findById(mongoId)
        .select("walletBlance")
        .lean();

    if (!user) {
        throw new Error("User not found");
    }

    const userBalance = user.walletBlance || 0;

    const coinPerMinute = {
        chatRoom: 12,
        audioRoom: 20,
    };

    if (!coinPerMinute[roomType]) {
        throw new Error("Invalid room type");
    }

    const chargePerMinute = coinPerMinute[roomType];

    const totalMinutes = userBalance / chargePerMinute;


    const totalMilliseconds = totalMinutes * 60 * 1000;

    return Math.floor(totalMilliseconds);
};
const moneyTransfer = async (boyId, girlId, time, roomType) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const chargePerMinute = {
            chatRoom: 12,
            audioRoom: 20,
        };

        if (!chargePerMinute[roomType]) {
            throw new Error("Invalid room type");
        }

        const coinPerSecond = chargePerMinute[roomType] / 60;

  
        const coins = +(coinPerSecond * time).toFixed(0);
        const mongoBoyId= new mongoose.Types.ObjectId(boyId)
        const boy = await User.findById(mongoBoyId).session(session);

        if (!boy) {
            throw new Error("Boy not found");
        }

        if (boy.walletBlance < coins) {
            throw new Error("Insufficient wallet balance");
        }
        const mongoGirlId= new mongoose.Types.ObjectId(girlId)
        const girl = await Girls.findById(mongoGirlId).session(session);

        if (!girl) {
            throw new Error("Girl not found");
        }

        // Update balances
        boy.walletBlance -= coins;
        girl.walletBlance += coins;
        const newCoinTransaction= new Transaction({
            senderId:mongoBoyId,
            receiverId:mongoGirlId,
            coinAmount:coins

        }) 
        await newCoinTransaction.save({session});
        await boy.save({ session });
        await girl.save({ session });


        await session.commitTransaction();

        return {
            success: true,
            transferredCoins: coins,
            boyBalance: boy.walletBlance,
            girlBalance: girl.walletBlance,
        };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};
export { calculateMiliScond , moneyTransfer};