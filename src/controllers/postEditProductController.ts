import { Request, Response, NextFunction } from "express";
import { editProduct } from '../config/mysql'
import { editProductType } from "../ts/types/editProductType";

const postEditProductController = (req: Request, res: Response, next: NextFunction) => {
    
    const b = req.body;

    const placeholder: editProductType = {
        category_id: b.category_id,
        name: b.name,
        price: b.price,
        stock: b.stock,
        specs: JSON.stringify(b.specs),
        product_id: b.product_id
    };
    
    editProduct(placeholder)
        .then(() => {
            console.log(`Product ID -> ${b.product_id} EDITED`);
            res.status(200).json({"message":`Product ID -> ${b.product_id} EDITED`});
        })
        .catch(err => {
            console.log(err);
            res.status(500);
        })

}

export default postEditProductController;