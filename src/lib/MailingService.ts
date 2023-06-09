import {Mailgun} from "mailgun-js";
import mailgun from 'mailgun-js';
import {User} from "@prisma/client";

export const sendMailToUser = async (to: string[], subject: string, text: string, link?: string) : Promise<string> => {
    link = link ?? `http://localhost:3000${link}`;
    console.log(getUserHtmlTemplate(link, text));
    try {
        await sendMail(to, subject, text, getUserHtmlTemplate(link, text))
    } catch (e: any) {
        throw e;
    }
}

export const sendMailToInvestor = async (to: string[], subject: string, info: {
    projectName: string;
    projectManagerInfo: User;
    numOfAssessmentProviders: number;
    numOfSentDPPs: number;
    numOfAssessedDPPs: number;
    numOfSentDGDs: number;
    numOfAssessedDGDs: number;
}) : Promise<string> => {
    console.log(info);
    try {
        await sendMail(to, subject, "Poslano vam je bilo poročilo o projektu", getInvestorHtmlTemplate(info));
    } catch (e: any) {
        throw e;
    }
}

const sendMail = async (to: string[], subject: string, text: string, html: string) => {
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = "sandbox2d3461b8766f45318cb6eba050908c0c.mailgun.org";
    const mg: Mailgun = mailgun({ apiKey: apiKey || '', domain });
    console.log(mg);
    const from = `Docu-Verification dApp <mailgun@${domain}>`;

    try {
        return mg.messages().send({
            from: from,
            to: to,
            subject: subject,
            html: html,
            text: text
        });
    } catch (e: any) {
        throw e;
    }
}

const getUserHtmlTemplate = (link?: string, text: string) => {
    return link
    ? `<!DOCTYPE html>
    <html>
        <head>
          <meta charset="UTF-8">
          <title>Docu-Verification</title>
        </head>
        <body>
          <h3>${text}</h3>
          <p>Podrobnosti:</p>
          <a href="${link}">${link}</a>
          <p>To je avtomatsko generirano sporočilo aplikacije Docu-Verification dApp</p>
        </body>
    </html>
    ` :
        `<!DOCTYPE html>
    <html>
        <head>
          <meta charset="UTF-8">
          <title>Docu-Verification</title>
        </head>
        <body>
          <h3>${text}</h3>
          <p>To je avtomatsko generirano sporočilo aplikacije Docu-Verification dApp</p>
        </body>
    </html>
    `
}

const getInvestorHtmlTemplate = (info: {
    projectName: string;
    projectManagerInfo: User;
    numOfAssessmentProviders: number;
    numOfSentDPPs: number;
    numOfAssessedDPPs: number;
    numOfSentDGDs: number;
    numOfAssessedDGDs: number;
}) => {
    return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
        <style>
          body {
            background-color: #ffffff;
            color: black;
            font-family: Arial, sans-serif;
          }
          h2 {
            color: #f78172;
          }
          .container {
            padding: 20px;
            border: 2px solid #f78172;
            margin-bottom: 20px;
            border-radius: 8px;
          }
          .container:last-child {
            margin-bottom: 0;
          }
          .container p:last-child {
            margin-bottom: 0;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Projektni vodja</h2>
          <p><strong>Ime in priimek:</strong> ${info.projectManagerInfo.name}</p>
          <p><strong>E-pošta:</strong> ${info.projectManagerInfo.email}</p>
          <p><strong>Telefon:</strong> ${info.projectManagerInfo.phone}</p>
        </div>
      
        <div class="container">
          <h2>Poročilo</h2>
          <p><strong>Ime projekta:</strong> ${info.projectName}</p>
          <p><strong>Število identificiranih mnenjedajalcev:</strong> ${info.numOfAssessmentProviders}</p>
          <p><strong>Število poslanih DPP-jev:</strong> ${info.numOfSentDPPs}/${info.numOfAssessmentProviders}</p>
          <p><strong>Število pridobljenih projektnih pogojev:</strong> ${info.numOfAssessedDPPs}/${info.numOfSentDPPs}</p>
          <p><strong>Število poslanih DGD-jev:</strong> ${info.numOfSentDGDs}/${info.numOfAssessmentProviders}</p>
          <p><strong>Število pridobljenih projektnih mnenj:</strong> ${info.numOfAssessedDGDs}/${info.numOfSentDGDs}</p>
        </div>
      </body>
      </html>
    `
}

