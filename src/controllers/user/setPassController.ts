import { Request, Response, NextFunction } from "express";
// import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
// import { randomUUID } from "crypto";
import { findPassToken, setPass } from '../../config/mysql';
// import { actTokenType } from "../../ts/types/user/actTokenType";
// import { emailDataType } from "../../ts/types/email/emailDataType";

import dotenv from 'dotenv';
import { setPassType } from "../../ts/types/user/setPassType";
import { findPassType } from "../../ts/types/user/findPassType";
dotenv.config();

const setPassController = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.params.token) return res.status(400).send("Token neexistuje");
    const b = req.body;
    if(b.pass !== b.pass2) return res.status(200).send("Heslá sa nezhodujú");

    findPassToken([req.params.token])
        .then(async (data) => {
            if(data.length === 0) return res.status(400).send("Platnosť odkazu na obnovu hesla vypršala");
            const result: findPassType[] = data as findPassType[];

            const ttl: number = new Date(result[0].pass_rst_ttl).getTime();
            if(ttl > Date.now()) {
                const setPassData: setPassType = {
                    pass: await bcrypt.hash(b.pass, 10),
                    user_id: result[0].user_id
                }
    
                setPass(setPassData)
                    .then(() => {
                        return res.status(200).send("Nové heslo uložené");
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).send("Error");
                    });
            }
            else return res.status(200).send("Platnosť odkazu vypršala, skúste znova obnoviť heslo");

        })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error");
        })



}

export default setPassController;