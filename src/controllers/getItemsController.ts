import { Request, Response, NextFunction } from "express";
import { getItems } from '../config/mysql';

const getItemsController = (req: Request, res: Response, next: NextFunction) => {

    getItems()
        .then(items => {
            console.log(items);
            res.status(200).send(items);
        })
        .catch(err => {
            console.log(err);
            res.status(500);
        })
        
}

export default getItemsController;