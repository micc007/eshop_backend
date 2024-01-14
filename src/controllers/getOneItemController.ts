import { Request, Response, NextFunction } from "express";
import { getOneItem } from '../config/mysql';

const getOneItemController = (req: Request, res: Response, next: NextFunction) => {

    const idArray: string[] = [req.params.id];
    
    getOneItem(idArray)
        .then(item => {
            console.log(item);
            res.status(200).send(item);
        })
        .catch(err => {
            console.log(err);
            res.status(500);
        })
        
}

export default getOneItemController;