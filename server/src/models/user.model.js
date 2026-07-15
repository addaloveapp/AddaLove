import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
    },
    age: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
        default:'https://ik.imagekit.io/ufopzzlbh/p.jpeg'
    },
    userType:{
        type:String,
        default:'Boy'
    },
    walletBlance:{
        type:Number,
        require:true,
        default:0
    },
    userBio:{
        type:String,
    },
    password:{
        type: String,
        required: true,

    }
},{ timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;