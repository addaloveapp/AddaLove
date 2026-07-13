import mongoose, { model } from "mongoose"
import { type } from "node:os";
const girlsSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
        default: 'https://ik.imagekit.io/ufopzzlbh/58964_BYSKi0X54.png'
    },
    vedioUrl: {
        type: String,
    },
    applicationStatus: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    userType: {
        type: String,
        default: 'Girl'
    },
    walletBlance: {
        type: Number,
        required: true,
        default: 0
    },
    applicationId:{
        type:String,
    },
    userBio:{
        type:String
    },
    password: {
        type: String,
        required: true,

    },
    publicKey: {
        type: String,
    },
}, { timestamps: true });
const Girls = mongoose.model('Girls', girlsSchema);
export default Girls;
