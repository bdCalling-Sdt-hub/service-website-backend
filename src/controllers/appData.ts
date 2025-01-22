import type { Request, Response, NextFunction } from "express";
import { getAppData, createAppData, updateAppData } from "../services/appData";
import responseBuilder from "../utils/responseBuilder";
import { getHTMLValidation, updateAppDataValidation } from "../validations/appData";

export async function getAppDataController(
  _: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const appData = await getAppData();

    if (!appData) {
      const newAppData = await createAppData({
        about: "About us",
        privacy: "Privacy policy",
        terms: "Terms and conditions",
      });
      return responseBuilder(response, {
        ok: true,
        statusCode: 200,
        message: "App data",
        data: newAppData,
      });
    }

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "App data",
      data: appData,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAppDataController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { about, privacy, terms } = updateAppDataValidation(request);

    const appData = await getAppData();

    if (!appData) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "App data not found",
      });
    }

    const newAppData = await updateAppData({
      about,
      privacy,
      terms,
    });

    return responseBuilder(response, {
      ok: true,
      statusCode: 200,
      message: "App data updated",
      data: newAppData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getHTMLController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const appData = await getAppData();

    const { page } = getHTMLValidation(request);

    if (!appData) {
      return responseBuilder(response, {
        ok: false,
        statusCode: 404,
        message: "App data not found",
      });
    }

    response.header("Content-Type", "text/html");
    response.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 30px auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1{
            color: #444;
        }
        footer {
            text-align: center;
            margin-top: 30px;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${
          page === "about.html"
            ? "About Us"
            : page === "privacy.html"
            ? "Privacy Policy"
            : "Trams of Services"
        }</h1>
        ${
          page === "about.html"
            ? appData.about
            : page === "privacy.html"
            ? appData.privacy
            : appData.terms
        }
    </div>
</body>
</html>
`);
  } catch (error) {
    next(error);
  }
}

export function privacyPolicy(
  _: Request,
  response: Response,
  __: NextFunction
) {
  response.header("Content-Type", "text/html");
    response.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 30px auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1{
            color: #444;
        }
        footer {
            text-align: center;
            margin-top: 30px;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>privacy.html</h1>
        <p>AGREEMENT TO OUR LEGAL TERMS<br>We are UpCloud Technologies (referred to as the \"Company\", \"we\", \"us\", or \"our\"), a company registered in Australia at 3 Ireland Street, Ringwood VIC 3134, South Australia, 3134.<br><br>We operate the mobile application BASP Australia (the \"App\"), as well as any other related products and services that refer or link to these legal terms (collectively, the \"Services\").<br><br>By accessing and using the Services, you agree to be bound by these terms. If you do not agree, you must discontinue using the Services immediately.<br><br>For any inquiries, you can contact us:<br><br>Phone: +614125270157<br>Email: mailto:munir.mirza@gmail.com<br>Address: 3 Ireland Street, Ringwood VIC 3134, South Australia, 3134, Australia<br>TABLE OF CONTENTS<br>Our Services<br>Intellectual Property Rights<br>User Representations<br>Purchases and Payment<br>Policy<br>Prohibited Activities<br>User Generated Contributions<br>Contribution License<br>Guidelines for Reviews<br>Mobile Application License<br>Services Management<br>Privacy Policy<br>Term and Termination<br>Modifications and Interruptions<br>Governing Law<br>Dispute Resolution<br>Corrections<br>Disclaimer<br>Limitations of Liability<br>Indemnification<br>User Data<br>Electronic Communications, Transactions, and Signatures<br>Miscellaneous<br>Contact Us<br>1. OUR SERVICES<br>The Services are not intended for use in any location where such access is unlawful or would subject us to legal requirements. Users are responsible for compliance with local laws.<br><br>2. INTELLECTUAL PROPERTY RIGHTS<br>We own all intellectual property rights related to the Services, including content, trademarks, and designs. You are granted a limited, non-transferable license to access and use the Services for personal, non-commercial purposes.<br><br>You may not reproduce, distribute, or modify any part of the Services without prior written permission.<br><br>3. USER REPRESENTATIONS<br>By using the Services, you represent that:<br><br>You are at least 18 years old.<br>You will not use the Services for illegal purposes.<br>You will provide accurate information.<br>4. PURCHASES AND PAYMENT<br>We accept payment through various methods. You must provide accurate payment information and update it as needed. Sales are final unless otherwise stated.<br><br>5. POLICY<br>All sales are final, and no refunds will be issued.<br><br>6. PROHIBITED ACTIVITIES<br>You agree not to:<br><br>Violate laws or regulations.<br>Use the Services for unauthorized commercial purposes.<br>Upload malicious software or spam.<br>Attempt to bypass security features.<br>7. USER GENERATED CONTRIBUTIONS<br>If you submit content through the Services, you guarantee that it does not infringe on third-party rights or violate laws. You retain ownership but grant us a license to use the content.<br><br>8. CONTRIBUTION LICENSE<br>By submitting content, you grant us the right to use, distribute, and modify it. We are not responsible for content you post.<br><br>9. GUIDELINES FOR REVIEWS<br>Reviews must be based on firsthand experience, free of offensive language, and compliant with all laws. We reserve the right to remove reviews.<br><br>10. MOBILE APPLICATION LICENSE<br>We grant you a limited license to use the App on your personal devices. You may not reverse-engineer or misuse the App in any way.<br><br>11. SERVICES MANAGEMENT<br>We reserve the right to:<br><br>Monitor activity on the Services.<br>Restrict or disable accounts.<br>Remove excessive or inappropriate content.<br>12. PRIVACY POLICY<br>By using the Services, you consent to our data practices outlined in our Privacy Policy.<br><br>13. TERM AND TERMINATION<br>We may terminate your access to the Services at any time for violations of these terms. You are prohibited from re-registering after termination.<br><br>14. MODIFICATIONS AND INTERRUPTIONS<br>We reserve the right to modify or discontinue the Services at any time. We are not liable for interruptions or downtime.<br><br>15. GOVERNING LAW<br>These terms are governed by the laws of Australia. Any disputes will be resolved in Australian courts.<br><br>16. DISPUTE RESOLUTION<br>Disputes will first undergo informal negotiations. If unresolved, they will be referred to arbitration under the European Arbitration Chamber.<br><br>17. CORRECTIONS<br>We may correct errors or inaccuracies in the Services without prior notice.<br><br>18. DISCLAIMER<br>The Services are provided \"as-is\". We are not liable for errors, interruptions, or third-party content.<br><br>19. LIMITATIONS OF LIABILITY<br>Our liability is limited to the amount paid by you for the Services within the one (1) month prior to the cause of action.<br><br>20. INDEMNIFICATION<br>You agree to indemnify us for any claims arising from your use of the Services or breach of these terms.<br><br>21. USER DATA<br>We are not responsible for any loss or corruption of your data. You are advised to maintain your own backups.<br><br>22. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES<br>By using the Services, you consent to electronic communications and transactions.<br><br>23. MISCELLANEOUS<br>These terms constitute the entire agreement between you and us. Any unenforceable provisions will not affect the validity of the remaining terms.<br><br>24. CONTACT US<br>For inquiries, contact us at:<br><br>UpCloud Technologies<br>Address: 3 Ireland Street, Ringwood VIC 3134, South Australia, 3134, Australia<br>Phone: +614125270157<br>Email: mailto:munir.mirza@gmail.com<br></p>
    </div>
</body>
</html>
`)
}