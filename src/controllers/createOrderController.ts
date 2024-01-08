import { Request, Response, NextFunction } from "express";
import { createOrder, createPayment } from '../config/mysql';
import { orderType } from "../ts/types/orderType";
import { orderItemType } from "../ts/types/orderItemType";
import { paymentType } from "../ts/types/paymentType";

import { nanoid } from 'nanoid'

const createOrderController = (req: Request, res: Response, next: NextFunction) => {
    
    const b = req.body;

    const paymentId = nanoid();

    let orderItemsArray: orderItemType[] = req.body.items;

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

    const paymentData: paymentType = {
        payment_id: paymentId,
        method: req.body.payment_method,
        status: false,
    }

    try {
        createPayment(paymentData);
        createOrder(orderData);
    }
    catch {
        console.log("500 - server failure");
        res.status(500).json({"message":"server failure"});
    }
    
    res.status(200).json({"message":"success"});
    
    
        
}

export default createOrderController;