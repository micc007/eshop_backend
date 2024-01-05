import { Request, Response, NextFunction } from "express";
import { addProduct } from '../config/mysql';
import { addProductType } from "../ts/types/addProductType";

import { nanoid } from 'nanoid'

const addProductController = (req: Request, res: Response, next: NextFunction) => {
    
    const b = req.body;

    const placeholder: addProductType = {
        product_id: nanoid(),
        category_id: b.category_id,
        name: b.name,
        price: b.price,
        stock: b.stock,
        specs: JSON.stringify(b.specs)
    };
    
    addProduct(placeholder);
        
    res.status(200).json({"message":"success"});
}

export default addProductController;