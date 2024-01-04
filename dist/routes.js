"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getItemsController_1 = __importDefault(require("./controllers/getItemsController"));
const getCategoriesController_1 = __importDefault(require("./controllers/getCategoriesController"));
const addProductController_1 = __importDefault(require("./controllers/addProductController"));
const addCategoryController_mts_1 = __importDefault(require("./controllers/addCategoryController.mts"));
const route = (0, express_1.Router)();
const message = () => {
    let message = "tralala";
    return message;
};
route.get('/', (req, res, next) => {
    res.send(message());
});
// eshop admin routes
route.post('/add_product', addProductController_1.default);
route.post('/add_category', addCategoryController_mts_1.default);
// eshop customer routes
route.get('/get_items', getItemsController_1.default);
route.get('/get_categories', getCategoriesController_1.default);
route.get('/item/:id');
route.post('/order');
exports.default = route;
