import { Request, Response, NextFunction } from "express";
import { getCategories } from '../config/mysql';

const getCategoriesController = (req: Request, res: Response, next: NextFunction) => {

    getCategories()
        .then(items => {
            console.log("get categories");
            res.status(200).send(items);
        })
        .catch(err => {
            console.log(err);
            res.status(500);
        })
        
}

export default getCategoriesController;