import mysql, { ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// TYPES
import { addProductType } from '../ts/types/product/addProductType';
import { addCategoryType } from '../ts/types/category/addCategoryType';
import { orderType } from '../ts/types/order/orderType';
import { paymentType } from '../ts/types/order/paymentType';
// import { orderItemType } from '../ts/types/orderItemType';
// import { itemDataType } from '../ts/types/itemDataType';
import { editProductType } from '../ts/types/product/editProductType';
import { editCategoryType } from '../ts/types/category/editCategoryType';
import { regUserType } from '../ts/types/user/regUserType';
import { regUserDataType } from '../ts/types/user/regUserDataType';
import { actTokenType } from '../ts/types/user/actTokenType';
import { passRecoveryType } from '../ts/types/user/passRecoveryType';
import { setPassType } from '../ts/types/user/setPassType';


const pool = mysql.createPool({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    database: process.env.DB_DATABASE as string
});

// universal query function for SELECT

async function selectQuery<T>(query: string, placeholder?: any[]): Promise<Partial<T[]>> {
    const [result] = await pool.execute(query, placeholder);
    return result as T[];
}

// universal query function for INSERT, UPDATE, DELETE

async function modifyQuery(query: string, props?: any): Promise<ResultSetHeader> {
    const placeholder = Object.values(props);
    const [result] = await pool.execute(query, placeholder);
    return result as ResultSetHeader;
}

// query functions for specific endpoints

const getItems = () => {
    const query: string = "SELECT p.product_id, p.name, p.price, p.stock, p.specs, c.category_id, c.category FROM products p, categories c WHERE c.category_id = p.category_id";
    return selectQuery(query);
}

const getCategories = () => {
    const query: string = "SELECT category_id, category FROM categories";
    return selectQuery(query);
}


const addProduct = (props: addProductType) => {
    const query: string = "INSERT INTO products(product_id, category_id, name, price, stock, specs) VALUES (?,?,?,?,?,?)";
    return modifyQuery(query, props);
}

const addCategory = (props: addCategoryType) => {
    const query: string = "INSERT INTO categories(category_id, category) VALUES (?,?)";
    return modifyQuery(query, props);
}

const getOneItem = (props: string[]) => {
    const query: string = "SELECT p.product_id, p.name, p.price, p.stock, p.specs, c.category FROM products p, categories c WHERE p.product_id=? AND c.category_id = p.category_id";
    return selectQuery(query, props);
}

const getOneCategory = (props: string[]) => {
    const query: string = "SELECT category_id, category FROM categories WHERE category_id=?";
    return selectQuery(query, props);
}

const editProduct = (props: editProductType) => {
    const query: string = "UPDATE products SET category_id=?, name=?, price=?, stock=?, specs=? WHERE product_id=?";
    return modifyQuery(query, props);
}

const editCategory = (props: editCategoryType) => {
    const query: string = "UPDATE categories SET category=? WHERE category_id=?";
    return modifyQuery(query, props);
}

const createOrder = (props: orderType) => {
    const query: string = "INSERT INTO orders(order_id, cust_reg, reg_cust_id, non_reg_cust, items, status, delivery, timestamp, payment_id) VALUES (?,?,?,?,?,?,?,?,?)";
    return modifyQuery(query, props);
}

const createPayment = (props: paymentType) => {
    const query: string = "INSERT INTO payments(payment_id, value, method, status) VALUES (?,?,?,?)";
    return modifyQuery(query, props);
}

const getItemPrices = (props: string[]) => {
    let ids: string = "";

    for(let i: number = 0; i < props.length; i++) {
        ids += `'${props[i]}'`
        if(i === props.length-1) continue;
        ids += ",";
    }

    console.log(ids);

    const query: string = `SELECT product_id, price, stock FROM products WHERE product_id IN (${ids})`;
    console.log(query);

    return selectQuery(query, props);
}

const updateStock = (props: [number, string]) => {
    const query: string = "UPDATE products SET stock=? WHERE product_id=?";
    return modifyQuery(query, props);
}

const findEmail = (props: string[]) => {
    const query: string = "SELECT user_id, email FROM users WHERE email=?";
    return selectQuery(query, props);
}

const regUser = (props: regUserType) => {
    const query: string = "INSERT INTO users (user_id, email, pass, act, act_link, act_ttl) VALUES (?,?,?,?,?,?)";
    return modifyQuery(query, props);
}

const regUserData = (props: [regUserDataType, string]) => {
    const query: string = "UPDATE users SET user_data=? WHERE user_id=?";
    return modifyQuery(query, props);
}

const findActToken = (props: string[]) => {
    const query: string = "SELECT user_id, act, act_link, act_ttl FROM users WHERE act_link=?";
    return selectQuery(query, props);
}

const activateAccount = (props: string[]) => {
    const query: string = "UPDATE users SET act=true, act_link=null, act_ttl=null WHERE user_id=?";
    return modifyQuery(query, props);
}

const passRecovery = (props: passRecoveryType) => {
    const query: string = "UPDATE users SET pass_rst=?, pass_rst_ttl=? WHERE user_id=?";
    return modifyQuery(query, props);
}

const findPassToken = (props: string[]) => {
    const query: string = "SELECT user_id, pass, pass_rst, pass_rst_ttl FROM users WHERE pass_rst=?";
    return selectQuery(query, props);
}

const setPass = (props: setPassType) => {
    const query: string = "UPDATE users SET pass=?, pass_rst=null, pass_rst_ttl=null WHERE user_id=?";
    return modifyQuery(query, props);
}

const findUser = (props: string[]) => {
    const query: string = "SELECT user_id, email, act, pass, user_data FROM users WHERE email=?";
    return selectQuery(query, props);
}

export { 
    getItems,
    getCategories,
    addProduct,
    addCategory,
    getOneItem,
    getOneCategory,
    editProduct,
    editCategory,
    createOrder,
    createPayment,
    getItemPrices,
    updateStock,
    findEmail,
    regUser,
    regUserData,
    findActToken,
    activateAccount,
    passRecovery,
    findPassToken,
    setPass,
    findUser
}