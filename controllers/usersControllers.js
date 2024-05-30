import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/users.js";
import Jimp from "jimp";
import { registerUserSchema } from "../schemas/userSchema.js";
import mail from "../mail.js";

export const getAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.avatarURL === null) {
      return res.status(404).json({ message: "Avatar not found" });
    }

    res.sendFile(path.resolve("public/avatars", user.avatarURL));
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    const newPath = path.resolve("public/avatars", req.file.filename);
    await fs.rename(req.file.path, newPath);
    const image = await Jimp.read(newPath);
    await image.resize(250, 250).writeAsync(newPath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: req.file.filename },
      { new: true }
    );

    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const refreshVerify = async (req, res, next) => {
  const { email } = req.body;
  const { error } = registerUserSchema.validate({ email });
  if (error) {
    return res.status(400).json({ message: "Missing required field email" });
  }

  try {
    const user = await User.findOne({ email });
    if (user === null) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    const message = {
      to: email,
      from: "lyubawa81@ukr.net",
      subject: "Welcome to your contacts!",
      html: `To confirm your email please click to the link <a href="http://localhost:3000/users/verify/${verificationToken}">Link</a>`,
      text: `To confirm your email please open the link http://localhost:3000/users/verify/${verificationToken}`,
    };

    await mail.sendMail(message);
    res.send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
