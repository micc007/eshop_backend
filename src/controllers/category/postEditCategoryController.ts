import { Request, Response, NextFunction } from "express";
import { editCategory } from "../../config/mysql";
import { editCategoryType } from "../../ts/types/category/editCategoryType";

const postEditCategoryController = (req: Request, res: Response, next: NextFunction) => {
    
    const placeholder: editCategoryType = {
        category: req.body.category,
        category_id: req.body.category_id,
    };
    
    editCategory(placeholder)
        .then(() => {
            console.log(`Category ID -> ${req.body.category_id} EDITED`);
            res.status(200).json({"message":`Category ID -> ${req.body.category_id} EDITED`});
        })
        .catch(err => {
            console.log(err);
            res.status(500);
        });
        
}

export default postEditCategoryController;