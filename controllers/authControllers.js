import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import { registerUserSchema, loginUserSchema } from "../schemas/userSchema.js";
import gravatar from "gravatar";

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = registerUserSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const user = await User.findOne({ email });

    if (user !== null) {
      return res.status(409).json({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userAvatar = gravatar.url(email);

    await User.create({
      email: email,
      password: passwordHash,
      avatarURL: userAvatar,
    });

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = loginUserSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const user = await User.findOne({ email });

    if (user === null) {
      console.log("Email");
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      console.log("Password");
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2 days" }
    );

    await User.findByIdAndUpdate(user._id, { token });

    res.send({ token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (req, res, next) => {
  const { id } = req.user;
  try {
    const userById = await User.findById(id);

    if (userById === null) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res
      .status(200)
      .json({ email: userById.email, subscription: userById.subscription });
  } catch (error) {
    next(error);
  }
};
