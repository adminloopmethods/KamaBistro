import {emailTransporter} from "../config/index.js";
import {logger} from "../config/index.js";
// Function to send an email
const sendEmail = async (emailPayload) => {
  const info = await emailTransporter.sendMail({
    ...emailPayload,
    from: process.env.SMTP_USER_EMAIL,
  });
  logger.info({
    ...info,
    status: "success",
    response: "Email sent successfully",
  });
  return true;
};

export {sendEmail};
