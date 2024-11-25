import nodemailer from "nodemailer";
import "dotenv/config";

const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) {
  console.error("FRONTEND_URL is required in .env");
  process.exit(1);
}

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
  userId,
}: {
  email: string;
  userName: string;
  businessName: string;
  id: string;
  userId: string;
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
                
                <a href="${frontendUrl}/review/${id}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Leave a Review
                </a>
                
                <p>Thank you for your time and feedback. If you have any additional comments or suggestions, please feel free to reach out to us.</p>
                <p>Best regards,</p>
                <p><strong>The BASP Team</strong></p>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; padding: 20px; border-top: 1px solid #dddddd;">
                <a href="${frontendUrl}/unsubscribe?id=${userId}" style="font-size: 14px; color: #666666; text-decoration: none;">
                    Unsubscribe
                </a>
            </td>
        </tr>
    </table>
</body>
</html>
`;
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

export function sendInvoiceEmail(email: string, invoiceUrl: string) {
  const subject = "Your Payment Invoice";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Payment Invoice</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
        <tr>
            <td>
                <h2 style="color: #333333;">Thank You for Your Payment!</h2>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; color: #333333;">
                <p>Dear Customer,</p>
                <p>We appreciate your prompt payment for [service/product]. We are pleased to inform you that your payment has been successfully processed.</p>
                <p>For your records, you can view and download your invoice by clicking the link below:</p>
                <p>
                    <a href="${invoiceUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        View Invoice
                    </a>
                </p>
                <p>If you have any questions or need further assistance, please feel free to contact us.</p>
                <p>Thank you for choosing <strong>BASP</strong>.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <p>Best regards,</p>
                <p><strong>The BASP Team</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>
`;
  return emailWithNodemailer({ email, subject, html });
}

export function sendMonthlyReportEmail({
  email,
  businessOwnerName,
  startDate,
  endDate,
  communications,
}: {
  email: string;
  businessOwnerName: string;
  startDate: Date;
  endDate: Date;
  communications: { name: string; type: string; createdAt: Date }[];
}) {
  const subject = "Your Monthly Report";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monthly Communication Summary</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
        <tr>
            <td>
                <h2 style="color: #333333;">Your Monthly Communication Summary</h2>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; color: #333333;">
                <p>Dear <strong>${businessOwnerName}</strong>,</p>
                <p>We are happy to provide you with a summary of your client interactions for <strong>${startDate.toLocaleDateString()}</strong> to <strong>${endDate.toLocaleDateString()}</strong>.</p>
                <ul>
                    <li><strong>Total Messages:</strong> ${
                      communications.filter(
                        (communication) => communication.type === "MESSAGE"
                      ).length
                    }</li>
                    <li><strong>Total Calls:</strong> ${
                      communications.filter(
                        (communication) => communication.type === "CALL"
                      ).length
                    }</li>
                </ul>

                <!-- List of message/call senders -->
                <p>Here’s a detailed list of who contacted you this month:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr>
                            <th style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: left;">Client Name</th>
                            <th style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: left;">Contact Type</th>
                            <th style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: left;">Date</th>
                            <th style="border-bottom: 1px solid #dddddd; padding: 10px; text-align: left;">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${communications
                          .map(
                            (communication) => `
                          <tr>
                              <td style="padding: 10px; border-bottom: 1px solid #dddddd;">${
                                communication.name
                              }</td>
                              <td style="padding: 10px; border-bottom: 1px solid #dddddd;">${
                                communication.type
                              }</td>
                              <td style="padding: 10px; border-bottom: 1px solid #dddddd;">${communication.createdAt.toLocaleDateString()}</td>
                              <td style="padding: 10px; border-bottom: 1px solid #dddddd;">${communication.createdAt.toLocaleTimeString()}</td>
                          </tr>
                          `
                          )
                          .join("")}
                    </tbody>
                </table>

                <p>We hope this overview helps you stay informed of your client communications. If you have any questions or need more details, don't hesitate to reach out to us.</p>
                <p>Thank you for trusting <strong>BASP</strong> with your business communications.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <p>Best regards,</p>
                <p><strong>The BASP Team</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>`;
  return emailWithNodemailer({ email, subject, html });
}

export function sendTicketNumberEmail(
  email: string,
  ticketNumber: string,
  userName: string,
  userId: string
) {
  const subject = "Your Ticket Confirmation";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
        <tr>
            <td style="text-align: center;">
                <h2 style="color: #333333;">Thank You for Your Feedback!</h2>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; color: #333333;">
                <p>Dear ${userName},</p>
                <p>We appreciate your review and value your insights. As a token of acknowledgment, here’s your unique ticket number for reference:</p>
                <p style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #007BFF;">${ticketNumber}</p>
                <p>This ticket number can be used for any future inquiries or follow-ups related to your review.</p>
                <p>If you have any questions or require further assistance, please don’t hesitate to contact our support team.</p>
                <p>Thank you for choosing <strong>BASP</strong>.</p>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; padding: 20px;">
                <p>Best regards,</p>
                <p><strong>The BASP Team</strong></p>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; padding: 20px; border-top: 1px solid #dddddd;">
                <a href="${frontendUrl}/unsubscribe?id=${userId}" style="font-size: 14px; color: #666666; text-decoration: none;">Unsubscribe</a>
            </td>
        </tr>
    </table>
</body>
</html>
`;
  return emailWithNodemailer({ email, subject, html });
}

export function sendJobApplicationNotification(
  email: string,
  applicantName: string,
  jobTitle: string,
  resumeLink: string
) {
  const subject = `New Application for ${jobTitle}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Job Application</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
        <tr>
            <td style="text-align: center;">
                <h2 style="color: #333333;">New Job Application Received</h2>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; color: #333333;">
                <p>Dear Hiring Manager,</p>
                <p>We wanted to inform you that <strong>${applicantName}</strong> has applied for the position of <strong>${jobTitle}</strong>.</p>
                <p>The applicant's resume is available below:</p>
                <p style="text-align: center; margin: 20px 0;">
                    <a href="${resumeLink}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        View Resume
                    </a>
                </p>
                <p>If you have any questions or need additional information, please feel free to reach out to our support team.</p>
                <p>Thank you for using <strong>BASP</strong> for your recruitment needs.</p>
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

export function sendPromotionEmail({
  email,
  promotionTitle,
  discount,
  startAt,
  endAt,
  businessName,
  promotionUrl
}: {
  email: string;
  promotionTitle: string;
  discount: number;
  startAt: Date;
  endAt: Date;
  businessName: string;
  promotionUrl: string;
}) {
  const subject = `Exciting New Promotion at ${businessName}!`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exclusive Promotion Just for You!</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
        <tr>
            <td style="text-align: center;">
                <h2 style="color: #333333;">Exclusive Offer Just for You!</h2>
                <p style="font-size: 18px; color: #007BFF;">Get ready to save big at <strong>${businessName}</strong>!</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; color: #333333;">
                <p>We are excited to announce a limited-time promotion:</p>
                <h3 style="font-size: 24px; color: #007BFF;">${promotionTitle}</h3>
                <p style="font-size: 20px; font-weight: bold; color: #FF6347;">${discount}% OFF</p>
                <p>This promotion is available from <strong>${startAt.toLocaleDateString()}</strong> to <strong>${endAt.toLocaleDateString()}</strong>.</p>
                <p>Don’t miss out on this amazing deal! Click below to get started:</p>
                <p style="text-align: center; margin: 20px 0;">
                    <a href="${promotionUrl}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Claim Your Discount
                    </a>
                </p>
                <p>If you have any questions or need assistance, feel free to reach out to us. We’re here to help!</p>
                <p>Thank you for being a valued customer at <strong>${businessName}</strong>.</p>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; padding: 20px;">
                <p>Best regards,</p>
                <p><strong>The ${businessName} Team</strong></p>
            </td>
        </tr>
    </table>
</body>
</html>
`;

  return emailWithNodemailer({ email, subject, html });
}
