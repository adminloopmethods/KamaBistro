import prismaClient from "../../config/dbConfig.js";
import {
  login,
  mfa_login,
  verify_mfa_login,
  logout,
  refreshToken,
  forgotPassword,
  resendOTP,
  resetPass,
  forgotPasswordVerify,
  updatePassword,
  getAllLogs,
  deleteLogsByDateRange as serviceDeleteLogsByDateRange,
} from "./auth.service.js";

const Login = async (req, res) => {
  const {email, password} = req.body;
  const response = await login(email, password);
  //Create and save the audit log 
  await prismaClient.auditLog.create({
    data: {
      actionType: "LOGIN",
      action_performed: response.message,
      entity: req.baseUrl.split("/").pop(),
      entityId: response.user.id,
      oldValue: null,
      newValue: null,
      ipAddress: req.ip,
      browserInfo: req.headers["user-agent"],
      outcome: "Success",
      timestamp: new Date(),
      user: {
        create: {
          userId: response.user.id,
        },
      },
    },
  });
  res.status(200).json(response);
};

const MFALogin = async (req, res) => {
  const {email, deviceId, otpOrigin} = req.body;
  const response = await mfa_login(email, deviceId, otpOrigin);
  res.status(201).json(response);
};

const VerifyMFALogin = async (req, res) => {
  const {email, deviceId, otp, otpOrigin} = req.body;
  const response = await verify_mfa_login(email, deviceId, otp, otpOrigin);
  res.status(200).json(response);
};

const Logout = async (req, res) => {
  const response = await logout(req.user);
  res.status(200).json(response);
};

const RefreshToken = async (req, res) => {
  const response = await refreshToken(req.user);
  res.status(201).json(response);
};

const ForgotPassword = async (req, res) => {
  const {email, deviceId, otpOrigin} = req.body;
  const response = await forgotPassword(email, deviceId, otpOrigin);
  res.status(201).json(response);
};

const ForgotPasswordVerify = async (req, res) => {
  const {email, deviceId, otp, otpOrigin} = req.body;
  const response = await forgotPasswordVerify(email, deviceId, otp, otpOrigin);
  res.status(200).json(response);
};

const UpdatePassword = async (req, res) => {
  const {email, deviceId, otpOrigin, new_password, repeat_password} = req.body;
  const response = await updatePassword(
    email,
    deviceId,
    otpOrigin,
    new_password,
    repeat_password
  );
  res.status(200).json(response);
};

const ResendOTP = async (req, res) => {
  const {email, deviceId, otpOrigin} = req.body;
  const userId = req.ip.replace(/^.*:/, ""); // Extract IP as user ID
  const response = await resendOTP(email, deviceId, otpOrigin, userId);
  res.status(201).json(response);
};

const ResetPass = async (req, res) => {
  const {email, old_password, new_password, repeat_password} = req.body;
  const response = await resetPass(
    email,
    old_password,
    new_password,
    repeat_password
  );
  res.status(201).json(response);
};

const GetAllLogs = async (req, res) => {
  const {search, status, page, limit, entity, startDate, endDate} = req.query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const response = await getAllLogs(search, status, pageNum, limitNum, entity, startDate, endDate);
  res.status(200).json(response);
};

const DeleteLogsByDateRange = async (req, res) => {
  const { startDate, endDate } = req.body;
  if (!startDate || !endDate) {
    return res.status(400).json({ message: "startDate and endDate are required" });
  }
  try {
    const count = await serviceDeleteLogsByDateRange(startDate, endDate);
    res.status(200).json({ message: `Deleted ${count} logs`, count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  Login,
  MFALogin,
  VerifyMFALogin,
  Logout,
  RefreshToken,
  ForgotPassword,
  ForgotPasswordVerify,
  UpdatePassword,
  ResendOTP,
  ResetPass,
  GetAllLogs,
  DeleteLogsByDateRange,
};
