import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'Girls']
  },
  receiver: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverModel'
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ['User', 'Girls']
  },
  encriptedMessage: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Message = model('Message', messageSchema);
export default Message;