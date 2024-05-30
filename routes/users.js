import express from "express";
import { uploadAvatar, getAvatar } from "../controllers/usersControllers.js";
import uploadMiddleware from "../middleware/upload.js";

const router = express.Router();

router.get("/avatars", getAvatar);
router.patch("/avatars", uploadMiddleware.single("avatar"), uploadAvatar);

export default router;
