import { Request, Response, NextFunction } from "express";
// import { getItems } from '../config/mysql';

const userLoginController = (req: Request, res: Response, next: NextFunction) => {

    const b = req.body;
    console.log(b.email);
    res.status(200).send(`logged in -> ${b.email}`);
        
}

export default userLoginController;