import {Schema, model} from 'mongoose';

const historySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'userModel'
    },
    userModel: {
        type: String,
        required: true,
        enum: ['User', 'Girls']
    },
    type: {
        type: String,
        required: true,
        enum: ['audiocall', 'videocall']
    }
}, { timestamps: true });

const History = model('History', historySchema);
export default History;