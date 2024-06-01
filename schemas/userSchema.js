import Joi from "joi";

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(8).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(8).required(),
});
