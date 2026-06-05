import { Router } from "express";
import {
    getMessages, 
    sendMessage
} from "../controllers/message.controller.js";
import { verifyUser } from "../middlewares/user.middleware.js";

const router = Router();

router.route("/allMessages").get(verifyUser, getMessages)
router.route("/sendMessage").post(verifyUser, sendMessage)

export default router;