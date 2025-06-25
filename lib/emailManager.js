import nodemailer from "nodemailer";
import "dotenv/config";

export function createTransport() {
  const options = {
    service: process.env.EMAIL_SERVICE_NAME,
    host: process.env.EMAIL_SERVICE_HOST,
    port: process.env.EMAIL_SERVICE_PORT,
    secure: process.env.EMAIL_SERVICE_SECURE === "true",
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASSWORD,
    },
  };
  return nodemailer.createTransport(options);
}

export async function sendEmail({ transport, to, subject, body }) {
  const result = await transport.sendMail({
    from: process.env.EMAIL_SERVICE_FROM,
    to,
    subject,
    html: body,
  });
  return result;
}

export function generatePreviewURL(sendResult) {
  return nodemailer.getTestMessageUrl(sendResult);
}
