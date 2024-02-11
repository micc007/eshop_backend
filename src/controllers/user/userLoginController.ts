import { Request, Response, NextFunction } from "express";
import passport from 'passport';
import { findUserType } from "../../ts/types/user/findUserType";

const userLoginController = (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate('local', (err: Error, user: boolean | findUserType, info: string ) => {
        if(err) return next(err);
        if(!user) return res.status(401).send(info)
        req.logIn(user, () => {
            if(err) return next(err);
            res.status(200).send(user);
        })
    })(req, res, next);
    
}

export default userLoginController;