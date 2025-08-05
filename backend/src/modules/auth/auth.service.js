import {logger} from "../../config/index.js";
import {
  assert,
  //  assertEvery
} from "../../errors/assertError.js";
import { compareEncryptedData, EncryptData } from "../../helper/bcryptManager.js";
import { generateToken } from "../../helper/jwtManager.js";
import { sendEmail } from "../../helper/sendEmail.js";
import {
  findUserByEmail,
  updateUserPassword,
  createOrUpdateOTP,
  findOTP,
  markOTPUsed,
  deleteOTP,
  createOrUpdateOtpAttempts,
  findAllLogs,
  deleteLogsByDateRange as repoDeleteLogsByDateRange,
} from "../../repository/user.repository.js";
import {generateRandomOTP} from "../../helper/generateOtp.js";


// MAIN SERVICE FUNCTIONS
const login = async (email, password) => {
  const user = await getUser(email);
  // if invalid password throw an error
  assert(
    await compareEncryptedData(password, user?.password),
    "BAD_REQUEST",
    "invalid password"
  );
  const token = generateToken(user);
  // this line removes the password from the userdata object
  const {password: userPassword, ...userData} = user;
  logger.info({...userData, response: "logged in successfully"});
  return {
    token: token,
    message: "Log in successful",
    user: {
      ...userData,
    },
  };
};

const mfa_login = async (email, deviceId, otpOrigin) => {
  const user = await getUser(email);
  const otp = await generateOtpAndSendOnEmail(user, deviceId, otpOrigin);
  return {message: `OTP has been Sent`, otp: otp};
};

const verify_mfa_login = async (email, deviceId, otp, otpOrigin) => {
  const user = await getUser(email);
  await verifyOTP(user?.id, deviceId, otp, otpOrigin);
  const token = generateToken(user);
  // this line removes the password from the userdata object
  const {password: userPassword, ...userData} = user;
  logger.info({...userData, response: "logged in successfully"});
  return {
    token: token,
    message: "Log in successful",
    user: {
      ...userData,
    },
  };
};

const logout = async (user) => {
  // add any functionality here
  logger.info(`user: ${user.name} has logged out`);
  return {message: "Logged out successfully"};
};

const refreshToken = async (user) => {
  const newToken = generateToken(user);
  logger.info(`token has been refreshed for user : ${user?.id}`);
  return {token: newToken, message: "Token updated successfully"};
};

const forgotPassword = async (email, deviceId, otpOrigin) => {
  const user = await getUser(email);
  const otp = await generateOtpAndSendOnEmail(user, deviceId, otpOrigin);
  return {message: `OTP has been Sent`, otp: otp};
};

const forgotPasswordVerify = async (email, deviceId, otp, otpOrigin) => {
  const user = await getUser(email);
  await verifyOTP(user?.id, deviceId, otp, otpOrigin);
  return {
    message: `OTP verified successfully`,
  };
};

const updatePassword = async (
  email,
  deviceId,
  otpOrigin,
  new_password,
  repeat_password
) => {
  const user = await getUser(email);
  // return error if new password and old password are same
  const otp = await findOTP(user.id, deviceId, otpOrigin);
  assert(otp && otp.isUsed, "UNAUTHORIZED", "Invalid request");
  assert(
    !(await compareEncryptedData(new_password, user?.password)),
    "BAD_REQUEST",
    "New password cannot be the same as previously used password"
  );
  assert(
    new_password === repeat_password,
    "BAD_REQUEST",
    "New password and repeat password do not match"
  );
  // if everything is OK, update password
  await updateUserPassword(user?.id, await EncryptData(new_password, 10));
  await deleteOTP(otp.id);
  return {message: "Passwords has been updated successfully"};
};
const resendOTP = async (email, deviceId, otpOrigin, userId) => {
  const user = await getUser(email);
  const otp = await generateOtpAndSendOnEmail(user, deviceId, otpOrigin);
  await createOrUpdateOtpAttempts(userId);
  return {message: `OTP has been Sent`, otp: otp};
};

const resetPass = async (
  email,
  old_password,
  new_password,
  repeat_password
) => {
  const user = await getUser(email);

  // return error if password not matches
  assert(
    await compareEncryptedData(old_password, user?.password),
    "BAD_REQUEST",
    "Invalid old password"
  );

  // return error if new password and old password are same
  assert(
    new_password !== old_password,
    "BAD_REQUEST",
    "New password cannot be the same as the old password"
  );

  // return error if new password and repeat password do not match
  assert(
    new_password === repeat_password,
    "BAD_REQUEST",
    "New password and repeat password do not match"
  );
  // if everything is OK, update password
  await updateUserPassword(user?.id, await EncryptData(new_password, 10));

  return {message: "Passwords has been updated successfully"};
};

// SUPPORT FUNCTIONS
//Returns user data if found and error if not found
const getUser = async (email) => {
  const user = await findUserByEmail(email);
  // if user not exist throw an error
  assert(user, "NOT_FOUND", "invalid email");
  // if user is blocked throw an error
  assert(
    user.status === "ACTIVE",
    "UNAUTHORIZED",
    "User is blocked by the super admin."
  );
  return user;
};

const verifyOTP = async (userId, deviceId, otp, otpOrigin) => {
  // Find OTP in the database
  const isOTPExist = await findOTP(userId, deviceId, otpOrigin);
  // Check if OTP exists
  assert(isOTPExist, "NOT_FOUND", "Otp not found, Please request a new OTP.");
  // Check if expiry date is greater than current date in milliseconds
  assert(
    new Date(isOTPExist.expiresAt).getTime() > Date.now(),
    "GONE",
    "Request Time out. Please request a new OTP."
  );
  // Check if OTP is used
  assert(
    !isOTPExist.isUsed,
    "BAD_REQUEST",
    "OTP is used. Please request a new OTP."
  );
  // Validate the OTP
  assert(
    await compareEncryptedData(otp, isOTPExist?.otpCode),
    "UNAUTHORIZED",
    "Invalid OTP"
  );
  // Mark OTP as used
  await markOTPUsed(isOTPExist.id);
  return true; // OTP verification successful
};

const generateOtpAndSendOnEmail = async (user, deviceId, otpOrigin) => {
  const otp = generateRandomOTP();
  // Send otp on email
  const emailPayload = {
    to: user.email,
    subject: "Shade Corporation: OTP for password reset request",
    text: `Please use the following OTP to reset your password: ${otp}. This OTP will expire in 5 minutes.`,
    html: `<p>Please use the following OTP to reset your password: <strong>${otp}</strong></p><p>This OTP will expire in 5 minutes.</p>`,
  };

  const isEmailSend = await sendEmail(emailPayload);

  // if email not sent throw an error
  // assert(isEmailSend, "EXPECTATION_FAILED", "Unable to send otp");

  // Store otp in database
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  await createOrUpdateOTP(
    user.id,
    deviceId,
    otpOrigin,
    await EncryptData(otp, 6), // encrypting otp before storing it with 6 rounds of salt
    expiresAt
  );
  logger.info(`Otp has been successfully sent on this email ${user.email}`);
  return otp;
};

const getAllLogs = async (search, status, pageNum, limitNum, entity, startDate, endDate) => {
  return await findAllLogs(search, status, pageNum, limitNum, entity, startDate, endDate);
};

const deleteLogsByDateRange = async (startDate, endDate) => {
  return await repoDeleteLogsByDateRange(startDate, endDate);
};

export {
  login,
  mfa_login,
  verify_mfa_login,
  logout,
  refreshToken,
  forgotPassword,
  forgotPasswordVerify,
  updatePassword,
  resendOTP,
  resetPass,
  getAllLogs,
  deleteLogsByDateRange,
};
