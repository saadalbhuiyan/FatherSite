// src/utils/mailer.js  (quick & dirty fix)
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saadalbhuiyan@gmail.com",
    pass: "ffyu ksss mlor dffv"
  }
});

export const sendMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({ from: "saadalbhuiyan@gmail.com", to, subject, text });
    console.log("Email sent to", to);
  } catch (error) {
    console.error("Email send failed:", error);
  }
};
