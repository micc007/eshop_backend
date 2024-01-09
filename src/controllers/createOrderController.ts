import { Request, Response, NextFunction } from "express";
import { createOrder, createPayment, getItemPrices } from '../config/mysql';
import { orderType } from "../ts/types/orderType";
import { orderItemType } from "../ts/types/orderItemType";
import { paymentType } from "../ts/types/paymentType";
import { itemDataType } from "../ts/types/itemDataType";

import { nanoid } from 'nanoid'

const createOrderController = async (req: Request, res: Response, next: NextFunction) => {
    
    const b = req.body;

    const paymentId = nanoid();

    
    let orderItemsArray: orderItemType[] = req.body.items;

    // fetch prices of cart items from database
    let itemIdArray: string[] = orderItemsArray.map(a => a.product_id);
    const itemData: any[] = await getItemPrices(itemIdArray);
    orderItemsArray.sort((a, b) => (a.product_id > b.product_id) ? 1 : ((b.product_id > a.product_id) ? -1 : 0))
    itemData.sort((a, b) => (a.product_id > b.product_id) ? 1 : ((b.product_id > a.product_id) ? -1 : 0))
    console.log(itemData);
    console.log(orderItemsArray)

    const orderData: orderType = {
        order_id: nanoid(),
        cust_reg: req.body.cust_reg,
        reg_cust_id: req.body.reg_cust_id, // change when user registration is implemented
        non_reg_cust: JSON.stringify(req.body.non_reg_cust), // change when user registration is implemented
        items: JSON.stringify({"items":orderItemsArray}),
        status: "created",
        delivery: req.body.delivery,
        timestamp: new Date(),
        payment_id: paymentId
    }

    let fullPrice: number = 0;
    for(let i: number = 0; i < itemData.length; i++) {
        fullPrice += (itemData[i].price * orderItemsArray[i].quantity);
    }

    console.log(fullPrice);

    const paymentData: paymentType = {
        payment_id: paymentId,
        value: fullPrice,
        method: req.body.payment_method,
        status: false,
    }

    console.log(paymentData);

    try {
        createPayment(paymentData);
        createOrder(orderData);
    }
    catch {
        console.log("500 - server failure");
        res.status(500).json({"message":"server failure"});
    }
    
    res.status(200).json({"message":"success"});


//     // {
//     "cust_reg": false,
//     "reg_cust_id": null,
//     "non_reg_cust": {"meno":"Michal", "priezvisko": "Mitro"},
//     "items": [
//         {
//             "product_id": "QDFOpjgIhPbQjBXfVDuif",
//             "quantity": 2
//         },
//         {
//             "product_id": "YYj4xXjKkqGUd8-iRCuKw",
//             "quantity": 2
//         },
//         {
//             "product_id": "nn9JiJ8ETo4SC8IHvz6R6",
//             "quantity": 1
//         },
//         {
//             "product_id": "bO6JK-6G2ImXhmZoLGCqU",
//             "quantity": 3
//         }
//     ],
//     "delivery": "courier",
//     "payment_method": "cash"
// }
    
    
        
}

export default createOrderController;