import nodemailer from "nodemailer";

// Create a transporter object using SMTP transport
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., 'smtp.example.com'
  port: process.env.SMTP_PORT, // e.g., 587
  secure: process.env.SMTP_SECURE, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER_EMAIL, 
    pass: process.env.SMTP_USER_PASSWORD,
  },
});

export default emailTransporter;