import mongoose from "mongoose"
const certificateSchema = new mongoose.Schema({
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
    position: {
        type: String,
        required: true,

    }
}, { timestamps: true })

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;