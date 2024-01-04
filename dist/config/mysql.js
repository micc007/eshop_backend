"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCategory = exports.addProduct = exports.getCategories = exports.getItems = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});
// universal query function for SELECT
async function selectQuery(query, placeholder) {
    const [result] = await pool.execute(query, placeholder);
    return result;
}
// universal query function for INSERT, UPDATE, DELETE
async function modifyQuery(query, props) {
    const placeholder = Object.values(props);
    const [result] = await pool.execute(query, placeholder);
    return result;
}
// query functions for specific endpoints
const getItems = () => {
    // upraviť category id na nanoid
    const query = "SELECT p.product_id, p.name, p.price, p.stock, p.specs, c.category FROM product p, category c WHERE c.category_id=1";
    return selectQuery(query);
};
exports.getItems = getItems;
const getCategories = () => {
    // upraviť category id na nanoid
    const query = "SELECT category_id, category FROM category";
    return selectQuery(query);
};
exports.getCategories = getCategories;
const addProduct = (props) => {
    const query = "INSERT INTO product(category_id, name, price, stock, specs) VALUES (?,?,?,?,?)";
    return modifyQuery(query, props);
};
exports.addProduct = addProduct;
const addCategory = (props) => {
    const query = "INSERT INTO category(category_id, category) VALUES (?,?)";
    return modifyQuery(query, props);
};
exports.addCategory = addCategory;
