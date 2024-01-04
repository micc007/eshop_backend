"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../config/mysql");
const addProductController = (req, res, next) => {
    const b = req.body;
    const placeholder = {
        category_id: b.category_id,
        name: b.name,
        price: b.price,
        stock: b.stock,
        specs: JSON.stringify(b.specs)
    };
    (0, mysql_1.addProduct)(placeholder);
    res.status(200).json({ "message": "success" });
};
exports.default = addProductController;
