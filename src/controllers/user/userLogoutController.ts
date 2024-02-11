import { Request, Response, NextFunction } from "express";
import passport from 'passport';
import { userResponseType } from "../../ts/types/user/userResponseType";
// import { findUserType } from "../../ts/types/user/findUserType";
// import { getItems } from '../config/mysql';

const userLogoutController = (req: Request, res: Response, next: NextFunction) => {

    req.logout((err) => { if (err)return next(err) });
    res.status(200).send(`Používateľ odhlásený`);
    
}

export default userLogoutController;