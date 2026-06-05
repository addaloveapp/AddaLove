import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiResponse} from "../utils/apiResponse.js";
import {ApiError} from '../utils/apiError.js';
import Message from '../models/message.model.js';
import History from '../models/history.model.js';
import User from '../models/user.model.js';
import Girls from '../models/girls.model.js';

const getMessages = asyncHandler(async (req, res) => {})

const sendMessage = asyncHandler(async (req, res) => {})

export {
    getMessages, 
    sendMessage
}