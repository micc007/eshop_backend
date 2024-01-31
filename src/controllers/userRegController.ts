import { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { findEmail, regUser } from '../config/mysql';
import { regUserType } from "../ts/types/regUserType";

const userRegController = (req: Request, res: Response, next: NextFunction) => {
    
    const b = req.body;

    if(b.email !== undefined && b.pass !== undefined && b.pass2 !== undefined) {
        findEmail([b.email])
            .then(async (user) => {
                if(user.length > 0) return res.status(200).send("User email is already registered, pick a different one");
                if(b.pass !== b.pass2) return res.status(200).send("Passwords are not identical");

                const hashPass: string = await bcrypt.hash(b.pass, 10);
                const actLink: string = randomUUID();
                const expiresAt: number = 1000 * 60 * 60 * 24;

                const regUserData: regUserType = {
                    user_id: nanoid(),
                    email: b.email,
                    pass: hashPass,
                    act: actLink,
                    act_ttl: new Date(Date.now() + expiresAt).toISOString().slice(0, 19).replace('T', ' ')
                }

                regUser(regUserData)
                    .then(() => {

                        // send email with activation link here
                        // process.env.FRONTEND_SHOP_URL

                        return res.status(200).send("Account created! We sent you an activation email, click the included link to activate your account");
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