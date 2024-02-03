import { Request, Response, NextFunction } from "express";
import { findActToken, activateAccount } from '../../config/mysql';
import { actTokenType } from "../../ts/types/user/actTokenType";

import dotenv from 'dotenv';
dotenv.config();

const userActivationController = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.params.token) return res.status(400).send("Token neni");
    
    const token: string[] = [req.params.token]

    findActToken(token)
        .then((data) => {
            if(data.length === 0) return res.status(400).send("Activation link has expired, please register again");
            const result: actTokenType[] = data as actTokenType[];
            const userId: string[] = [result[0].user_id];
            activateAccount(userId)
                .then(() => {
                    return res.status(200).send("User account activated!");
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).send("Error - account activation");
                })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error - provided token not found");
        });
    
}

export default userActivationController;