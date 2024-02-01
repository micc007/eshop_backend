import { Request, Response, NextFunction } from "express";
import { getOneCategory } from "../../config/mysql";

const getEditCategoryController = (req: Request, res: Response, next: NextFunction) => {

    const idArray: string[] = [req.body.category_id];

    getOneCategory(idArray)
        .then(item => {
            console.log(item);
            res.status(200).send(item);
        })
        .catch(err => {
            console.log(err);
            res.status(500);
        });

}

export default getEditCategoryController;