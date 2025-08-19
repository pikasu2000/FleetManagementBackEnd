const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GOOGLE_APP_GMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.GOOGLE_APP_GMAIL,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendMail;
