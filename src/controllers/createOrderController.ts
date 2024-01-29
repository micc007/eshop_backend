import { Request, Response, NextFunction } from "express";
import { createOrder, createPayment, getItemPrices, updateStock } from '../config/mysql';
import { orderType } from "../ts/types/orderType";
import { orderItemType } from "../ts/types/orderItemType";
import { paymentType } from "../ts/types/paymentType";
import { itemDataType } from "../ts/types/itemDataType";

import { nanoid } from 'nanoid'

const createOrderController = async (req: Request, res: Response, next: NextFunction) => {
    
    const b = req.body;
    const paymentId = nanoid();
    let orderItemsArray: orderItemType[] = b.items;
    let itemIdArray: string[] = orderItemsArray.map(a => a.product_id); // select product IDs for fetch function

    const itemData: any[] = await getItemPrices(itemIdArray); // fetch prices of cart items from database
    orderItemsArray.sort((a, b) => (a.product_id > b.product_id) ? 1 : ((b.product_id > a.product_id) ? -1 : 0))
    itemData.sort((a, b) => (a.product_id > b.product_id) ? 1 : ((b.product_id > a.product_id) ? -1 : 0))
    console.log(itemData);
    console.log(orderItemsArray)
    
    let availabilityMap = new Map<string, boolean>(); // check if all cart items are in stock in desired quantity, false if stock is not sufficient

    for(let i: number = 0; i < itemData.length; i++) {
        if(orderItemsArray[i].quantity > itemData[i].stock) availabilityMap.set(itemData[i].product_id, false);
        else availabilityMap.set(itemData[i].product_id, true);
    }

    if(isInStock(availabilityMap)){

        const orderId: string = nanoid();
        // if all items are available in desired quantity, create order
        const orderData: orderType = {
            order_id: orderId,
            cust_reg: b.cust_reg,
            reg_cust_id: b.reg_cust_id, // change when user registration is implemented
            non_reg_cust: JSON.stringify(b.non_reg_cust), // change when user registration is implemented
            items: JSON.stringify({"items":orderItemsArray}),
            status: "created",
            delivery: b.delivery,
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
            method: b.payment_method,
            status: false,
        }
        
        console.log(paymentData);
        
        try {
            await createPayment(paymentData);
            await createOrder(orderData);
            await changeStock(itemData, orderItemsArray);
        }
        catch {
            console.log("500 - server failure");
            res.status(500).send("server failure");
        }
        
        res.status(200).send(`Order ID ${orderId} created`);
    }
    else {
        // if any item is not available in desired quantity, just return message and hash map
        res.status(200).send({
            "message":"Order not created - some items are not available in desired quantity",
            availabilityMap
        })
    }
                          
}
    
    const isInStock = (map: Map<string, boolean>): boolean => {
        
        for(let value of map.values()) {
            if(!value) return false;
        }
        return true;
    }

    const changeStock = (fetch: any[], cart: orderItemType[]) => {
        for(let i: number = 0; i < fetch.length; i++) {
            let placeholder: [number, string] = [
                fetch[i].stock - cart[i].quantity,
                fetch[i].product_id
            ];
            updateStock(placeholder);
        }
    }

export default createOrderController;

// {
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