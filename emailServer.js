require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(
  cors({
    // Set allowed origin from .env or allow all origins for testing
    origin: process.env.CORS_ALLOWED_ORIGIN || "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-access-token"],
  })
);

app.use(bodyParser.json());

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.use((req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token || token !== process.env.SECRET_TOKEN) {
    return res.status(403).send("Access denied");
  }
  next();
});

// Common Email Template Function
const generateEmailTemplate = (content) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>icRamp Email</title>
      <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333; }
          .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
          .header { text-align: center; padding: 6px; }
          .header img { width: 250px; }
          .content { padding: 10px; text-align: center; }
          .content h1 { font-size: 24px; color: #333333; }
          .content p { font-size: 16px; color: #777777; }
          .content .code { font-size: 28px; font-weight: bold; color: #ff5722; background-color: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px; margin-top: 10px; }
          .button-container { margin-top: 20px; }
          .button { background-color: #4CAF50; color: white; padding: 15px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; background-color: #f4f4f4; color: #777777; font-size: 14px; }
          .footer img { width: 30px; margin: 0 10px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <img src="https://raw.githubusercontent.com/reymom/ic2P2ramp/ic-prod-network/src/assets/icR-logo-rectangular.png" alt="icRamp">
          </div>
          <div class="content">
              ${content}
          </div>
          <div class="footer">
              <p>If you have any questions, feel free to connect with us on social media:</p>
              <div style="display: inline-block; vertical-align: middle;">
                <a href="https://t.me/+1qd_xreS_hpkMTBk" target="_blank">
                  <img src="https://raw.githubusercontent.com/reymom/email-server/refs/heads/develop/assets/telegram-icon.png" alt="Telegram">
                </a>
              </div>
              <div style="display: inline-block; vertical-align: middle; margin-left: 10px;">
                <a href="https://x.com/ic_rampXYZ?t=kjzM0v-CJiSfGR_RC8qSCg&s=09" targer="_blank">
                  <img src="https://raw.githubusercontent.com/reymom/email-server/refs/heads/develop/assets/twitter-icon.png" alt="Twitter" style="width: 33px!important">
                </a>
              </div>
              <p>Visit our website: <a href="https://sandbox.icramp.xyz">icRamp</a></p>
          </div>
      </div>
  </body>
  </html>
`;

// Route to send confirmation email
app.post("/send-confirmation-email", (req, res) => {
  const { to, token, domain } = req.body;

  const htmlContent = generateEmailTemplate(`
    <h1>You Are Almost There!</h1>
    <p>Only one step left to become a part of icRamp. Please enter this verification code in the window where you started creating your account or click the button below.</p>
    <div class="code">${token}</div>
    <div class="button-container">
        <a href="${domain}/confirm-email?token=${token}" class="button" style="background-color: #4CAF50; color: white !important">Confirm my email</a>
    </div>
  `);

  const mailOptions = {
    from: `"icRamp Team" ${process.env.EMAIL_USER}`,
    to: to,
    subject: "Email Confirmation",
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send(error.toString());
    }
    console.log("Email sent:", info.response);
    res.status(200).send("Email sent: " + info.response);
  });
});

app.post("/send-password-reset-email", (req, res) => {
  const { to, resetToken, domain } = req.body;

  const htmlContent = generateEmailTemplate(`
    <h1>Reset Your Password</h1>
    <p>Please click the button below to reset your password:</p>
    <div class="button-container">
        <a href="${domain}/reset-password?token=${resetToken}" class="button" style="background-color: #4CAF50; color: white !important">Reset Password</a>
    </div>
  `);

  const mailOptions = {
    from: `"icRamp Team" ${process.env.EMAIL_USER}`,
    to: to,
    subject: "Password Reset",
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send(error.toString());
    }
    console.log("Email sent:", info.response);
    res.status(200).send("Password reset email sent: " + info.response);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
