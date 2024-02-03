import { Request, Response, NextFunction } from "express";
// import { nanoid } from "nanoid";
import { randomUUID } from "crypto";
import { findEmail, passRecovery } from '../../config/mysql';
import { mail } from "../../config/mailer";
import { emailDataType } from "../../ts/types/email/emailDataType";
import { findEmailType } from "../../ts/types/email/findEmailType";
import { passRecoveryType } from "../../ts/types/user/passRecoveryType";

import dotenv from 'dotenv';
dotenv.config();

const passRecoveryController = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.body.email) return res.status(400).send("Email not provided");
    
    findEmail([req.body.email])
        .then((data) => {
            const user: findEmailType[] = data as findEmailType[];
            const passRecLink: string = randomUUID();
            const expiresAfter: number = 1000 * 60 * 60 * 24;
            const passRecData: passRecoveryType = {
                pass_rst: passRecLink,
                pass_rst_ttl: new Date(Date.now() + expiresAfter).toISOString().slice(0, 19).replace('T', ' '),
                user_id: user[0].user_id
            }

            passRecovery(passRecData)
                .then(async () => {

                    const link: string = `${process.env.FRONTEND_SHOP_URL}${passRecLink}`;
                    const emailData: emailDataType = {
                        destination: user[0].email,
                        subject: "Aktivácia účtu",
                        html: `
                            <h1>Micc0's eshop</h1>
                            <h1>Aktivácia účtu</h2>
                            <br>
                            <p>Pre aktiváciu Vášho účtu kliknite na tento link</p>
                            <a href=${link}>${link}</a>
                        `
                    };

                    const result: boolean = await mail(emailData);
                    
                    if(result) {
                        console.log("Password recovery email sent");
                        res.status(200).send("We sent you an email with a link, click on the link to set a new password");
                    }
                    else res.status(500).send("Error occured while sending email");
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).send("Error");
                })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error");
        })
    
}

export default passRecoveryController;