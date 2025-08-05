import Joi from "joi";

const emailRule = Joi.string().email().min(3).max(30).required();
const passwordRule = Joi.string()
  .min(8)
  .max(30)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) //^[a-zA-Z0-9@._-]+$
  .required();
const otpOriginRule = Joi.string().min(8).max(30).required();
const deviceIdRule = Joi.string().min(6).max(20).required();
const otpRule = Joi.number().integer().min(100000).max(999999).required();

const loginSchema = Joi.object({
  email: emailRule,
  password: passwordRule,
});

const generateOtpSchema = Joi.object({
  email: emailRule,
  deviceId: deviceIdRule,
  otpOrigin: otpOriginRule,
});

const verifyOtpSchema = Joi.object({
  email: emailRule,
  deviceId: deviceIdRule,
  otp: otpRule,
  otpOrigin: otpOriginRule,
});

const resetPassSchema = Joi.object({
  email: emailRule,
  old_password: passwordRule,
  new_password: passwordRule,
  repeat_password: passwordRule,
});

const updatePasswordSchema = Joi.object({
  email: emailRule,
  deviceId: deviceIdRule,
  otpOrigin: otpOriginRule,
  new_password: passwordRule,
  repeat_password: passwordRule,
});

export {
  loginSchema,
  generateOtpSchema,
  verifyOtpSchema,
  resetPassSchema,
  updatePasswordSchema,
};
