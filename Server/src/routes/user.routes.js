import { Router } from "express";
import {registerUser,  loginUser, logoutUser, getCurrentUser } from "../Controllers/user.controller.js";
import { upload } from "../MiddleWares/multer.middleware.js";
import { authMiddleware } from "../MiddleWares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
);


router.route("/loginUser").post(loginUser);
router.route("/logoutUser").post(authMiddleware, logoutUser);
router.route("/profile").get(authMiddleware, getCurrentUser);


export default router;