import {Mailgun} from "mailgun-js";
import mailgun from 'mailgun-js';

export const sendMailToUser = async (to: string[], subject: string, text: string, link: string) : Promise<string> => {
    link = `http://localhost:3000/projects/${link}`;

    try {
        await sendMail(to, subject, text, getUserHtmlTemplate(link, text))
    } catch (e: any) {
        throw e;
    }
}

export const sendMailToInvestor = async (to: string[], subject: string, text: string) : Promise<string> => {
    try {
        await sendMail(to, subject, text, getInvestorHtmlTemplate(text));
    } catch (e: any) {
        throw e;
    }
}

const sendMail = async (to: string[], subject: string, text: string, html: string) => {
    const apiKey = process.env.NEXT_PUBLIC_MAILGUN_API_KEY;
    const domain = "sandbox2d3461b8766f45318cb6eba050908c0c.mailgun.org";
    const mg: Mailgun = mailgun({ apiKey: apiKey || '', domain });
    console.log(mg);
    //const mg: Mailgun = mailgun({ apiKey, domain });
    //const mg = mailgun.client({ username: 'api', key: apiKey || '', timeout: 60000 });
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

const getUserHtmlTemplate = (link: string, text: string) => {
    return `
    <!DOCTYPE html>
    <html>
        <head>
          <meta charset="UTF-8">
          <title>Docu-Verification</title>
        </head>
        <body>
          <h3>${text}</h3>
          <p>Podrobnosti:</p>
          <a href="{{link}}">${link}</a>
          <p>To je avtomatsko generirano sporočilo aplikacije Docu-Verification dApp</p>
        </body>
    </html>
    `
}

//TODO: parse everyhting
const getInvestorHtmlTemplate = (text: string) => {
    return `
    <!DOCTYPE html>
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

