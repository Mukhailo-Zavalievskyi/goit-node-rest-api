import express from "express";
import {
  register,
  login,
  logout,
  currentUser,
} from "../controllers/authControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.post("/logout", authMiddleware, logout);
usersRouter.get("/current", authMiddleware, currentUser);

export default usersRouter;
