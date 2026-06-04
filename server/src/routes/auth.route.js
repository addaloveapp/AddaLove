import express from 'express';
import {sendOtp,otpVerify,register,login} from "../controllers/user.controller.js"
import {upload} from '../middlewares/multer.middleware.js'
const AuthRoute= express.Router();

AuthRoute.post('/send-otp',sendOtp);
AuthRoute.post('/verify-otp',otpVerify)
AuthRoute.post('/register',upload.single('profilePhoto'),register)
AuthRoute.post('/login',login);

export default AuthRoute;