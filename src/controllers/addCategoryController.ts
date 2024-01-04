import { Request, Response, NextFunction } from "express";
import { addCategory } from '../config/mysql';
import { addCategoryType } from "../ts/types/addCategoryType";

import { nanoid } from 'nanoid'

const addCategoryController = (req: Request, res: Response, next: NextFunction) => {
    
    const placeholder: addCategoryType = {
        category_id: nanoid(),
        category: req.body.category,
    };
    
    addCategory(placeholder);
        
    res.status(200).json({"message":"success"});
}

export default addCategoryController;