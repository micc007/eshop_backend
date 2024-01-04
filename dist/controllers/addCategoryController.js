"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_js_1 = require("../config/mysql.js");
const nanoid_1 = require("nanoid");
const addCategoryController = (req, res, next) => {
    const placeholder = {
        category_id: (0, nanoid_1.nanoid)(),
        category: req.body.category,
    };
    (0, mysql_js_1.addCategory)(placeholder);
    res.status(200).json({ "message": "success" });
};
exports.default = addCategoryController;
