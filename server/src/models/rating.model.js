import {Schema, model} from "mongoose";

const ratingSchema = new Schema({
    ratedBy: {
        type: Schema.Types.ObjectId,
        refPath: "userModel",
        required: true
    },
    ratedUser: {
        type: Schema.Types.ObjectId,
        refPath: "ratedUserModel",
        required: true
    },
    userModel: {
        type: String,
        enum: ["User", "Girls"],
        required: true
    },
    ratedUserModel: {
        type: String,
        enum: ["User", "Girls"],
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0.5
    }
}, {timestamps: true});

ratingSchema.index(
    { ratedBy: 1, ratedUser: 1, userModel: 1, ratedUserModel: 1 },
    { unique: true }
);

const Rating = model("Rating", ratingSchema);

export default Rating;
