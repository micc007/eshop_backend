import { Request, Response, NextFunction } from "express";
import { findActToken, activateAccount } from '../../config/mysql';
import { actTokenType } from "../../ts/types/user/actTokenType";

import dotenv from 'dotenv';
dotenv.config();

const userActivationController = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.params.token) return res.status(400).send("Token not provided");
    
    const token: string[] = [req.params.token]

    // NEED TO ADD TTL CHECK

    findActToken(token)
        .then((data) => {
            if(data.length === 0) return res.status(400).send("Platnosť odkazu na aktiváciu účtu vypršala");
            const result: actTokenType[] = data as actTokenType[];

            const ttl: number = new Date(result[0].act_ttl).getTime();
            if(ttl > Date.now()) {
                const userId: string[] = [result[0].user_id];
                activateAccount(userId)
                    .then(() => {
                        console.log(`User account activated -> ${result[0].user_id}`)
                        return res.status(200).send("Používateľský účet aktivovaný");
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).send("Error");
                    })
            }
            else return res.status(200).send("Platnosť odkazu vypršala, zaregistrujte sa znova");

        })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error");
        });
    
}

export default userActivationController;