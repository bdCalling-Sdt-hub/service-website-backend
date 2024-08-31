import nodemailer from "nodemailer";
import "dotenv/config";

const user = process.env.SMTP_USERNAME;
const pass = process.env.SMTP_PASSWORD;

if (!user || !pass) {
  console.error("SMTP_USERNAME and SMTP_PASSWORD are required in .env");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user,
    pass,
  },
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const handleEmailError = async (error: any, msg: any) => {
  if (error.responseCode === 454) {
    console.error("Too many login attempts, retrying after delay...");
    await delay(60000); // Delay for 1 minute
    try {
      await transporter.sendMail(msg);
      console.log("Email sent successfully after retry");
    } catch (retryError) {
      console.error("Failed to send email after retry: ", retryError);
    }
  } else {
    console.error("Failed to send email: ", error);
  }
};

const emailWithNodemailer = async ({
  email,
  subject,
  html,
}: {
  email: string;
  subject: string;
  html: string;
}) => {
  const mailOptions = {
    from: user, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent %s", info.response);
  } catch (error) {
    await handleEmailError(error, mailOptions);
  }
};

export function sendReviewEmail({
  email,
  userName,
  businessName,
  id,
}: {
  email: string;
  userName: string;
  businessName: string;
  id: string;
}) {
  const subject = "We Value Your Feedback!";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>We Value Your Feedback!</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
        <tr>
            <td style="text-align: center;">
                <h2 style="color: #333333;">We Value Your Feedback!</h2>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; color: #333333;">
                <p>Dear ${userName},</p>
                <p>Thank you for using <strong>BASP</strong> to connect with ${businessName}. We hope you were satisfied with the service provided!</p>
                <p>Your feedback is incredibly important to us and helps other customers make informed decisions. We would greatly appreciate it if you could take a moment to share your thoughts about your experience with ${businessName}.</p>
                
                    <a href="/review/${id}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Leave a Review
                    </a>
                <p>Thank you for your time and feedback. If you have any additional comments or suggestions, please feel free to reach out to us.</p>
                <p>Best regards,</p>
                <p><strong>The BASP Team</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>`;
  return emailWithNodemailer({ email, subject, html });
}

export function sendOTPEmail(email: string, otp: string, userName: string) {
  const subject = "OTP Verification";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
        <tr>
            <td style="text-align: center;">
                <h2 style="color: #333333;">Your OTP Code for Secure Access</h2>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; color: #333333;">
                <p>Dear ${userName},</p>
                <p>To complete your recent action on <strong>BASP</strong>, please use the following One-Time Password (OTP):</p>
                <p style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #007BFF;">${otp}</p>
                <p>This code is valid for the next 3 minutes. Please do not share this code with anyone for your security.</p>
                <p>If you did not request this code, please contact our support team immediately.</p>
                <p>Thank you for choosing <strong>BASP</strong>.</p>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; padding: 20px;">
                <p>Best regards,</p>
                <p><strong>The BASP Team</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>`;
  return emailWithNodemailer({ email, subject, html });
}
