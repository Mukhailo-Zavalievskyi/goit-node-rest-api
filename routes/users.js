import express from "express";
import {
  uploadAvatar,
  getAvatar,
  verify,
  refreshVerify,
} from "../controllers/usersControllers.js";
import uploadMiddleware from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/verify/:verificationToken", verify);
router.post("/verify", refreshVerify);
router.get("/avatars", authMiddleware, getAvatar);
router.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  uploadAvatar
);

export default router;
