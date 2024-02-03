import { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { findEmail, regUser } from '../../config/mysql';
import { mail } from "../../config/mailer";
import { regUserType } from "../../ts/types/user/regUserType";
import { emailDataType } from "../../ts/types/email/emailDataType";

import dotenv from 'dotenv';
dotenv.config();

const userRegController = async (req: Request, res: Response, next: NextFunction) => {
    
    const b = req.body;

    if(b.email !== undefined && b.pass !== undefined && b.pass2 !== undefined) {
        findEmail([b.email])
            .then(async (user) => {
                if(user.length > 0) return res.status(200).send("User email is already registered, pick a different one");
                if(b.pass !== b.pass2) return res.status(200).send("Passwords are not identical");

                const hashPass: string = await bcrypt.hash(b.pass, 10);
                const actLink: string = randomUUID();
                const expiresAfter: number = 1000 * 60 * 60 * 24;

                const regUserData: regUserType = {
                    user_id: nanoid(),
                    email: b.email,
                    pass: hashPass,
                    act: false,
                    act_link: actLink,
                    act_ttl: new Date(Date.now() + expiresAfter).toISOString().slice(0, 19).replace('T', ' ')
                }

                regUser(regUserData)
                    .then(async () => {

                        const link: string = `${process.env.FRONTEND_SHOP_URL}${actLink}`;

                        const emailData: emailDataType = {
                            destination: b.email,
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
                            console.log("Account activation email sent");
                            res.status(200).send("Account created! We sent you an activation email, click the included link to activate your account");
                        }
                        else res.status(500).send("Error occured while sending email");

                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).send("Error");
                    });
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send("Error");
            });

    }
    else {
        return res.status(400).send("400 - User data missing");
    }
        
}

export default userRegController;