import { Transporter } from "nodemailer";
import { emailDataType } from "../ts/types/email/emailDataType";
const nodemailer = require('nodemailer');

// import dotenv from 'dotenv';
// dotenv.config();

let transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    secure: true,
    service: "Outlook365",
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS,
    },
    from: process.env.EMAIL_ADDRESS
    // tls: {
    //     ciphers:'SSLv3'
    // }
});

const mail = async (data: emailDataType) => {

    console.log(`env funguje? -> ${process.env.EMAIL_ADDRESS}`)

    let mailOptions = {
        from: `Micc0's ESHOP <${process.env.EMAIL_ADDRESS}>`, // sender address
        to: data.destination, // list of receivers
        subject: data.subject, // Subject line
        html: data.html, // html body
        text: data.html
        /*
        attachments: [{
            filename: 'erasmuslogo.png',
            path: __dirname + '/img/erazmuslogo.png',
            cid: 'erasmuslogo'
        }]*/
    }

    const result = await transporter.sendMail(mailOptions)
    .catch((err) => {
        console.log(err)
        return false;
    })
    if(result.accepted) return true;
    else return false;

}

export {
    transporter,
    mail
}