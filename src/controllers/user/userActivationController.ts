import { Request, Response, NextFunction } from "express";
// import { nanoid } from "nanoid";
// import bcrypt from "bcrypt";
// import { randomUUID } from "crypto";
// import { findEmail, regUser } from '../../config/mysql';
// import { mail } from "../../config/mailer";
// import { regUserType } from "../../ts/types/user/regUserType";
// import { emailDataType } from "../../ts/types/email/emailDataType";

import dotenv from 'dotenv';
dotenv.config();

const userActivationController = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.params.token) return res.status(400).send("Token neni");

    res.status(200).send(`token -> ${req.params.token}`);

}

export default userActivationController;