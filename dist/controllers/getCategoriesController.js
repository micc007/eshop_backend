"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../config/mysql");
const getCategoriesController = (req, res, next) => {
    (0, mysql_1.getCategories)()
        .then(items => {
        console.log(items);
        res.status(200).send(items);
    })
        .catch(err => {
        console.log(err);
        res.status(500);
    });
};
exports.default = getCategoriesController;
