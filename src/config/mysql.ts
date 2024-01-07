import mysql, { ResultSetHeader } from 'mysql2/promise';
import { addProductType } from '../ts/types/addProductType';
import { addCategoryType } from '../ts/types/addCategoryType';

import dotenv from 'dotenv';
dotenv.config();

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
    const query: string = "SELECT p.product_id, p.name, p.price, p.stock, p.specs, c.category FROM products p, categories c WHERE c.category_id = p.category_id";
    return selectQuery(query);
}

const getOneItem = (props: string[]) => {
    const query: string = "SELECT p.product_id, p.name, p.price, p.stock, p.specs, c.category FROM products p, categories c WHERE p.product_id = ? AND c.category_id = p.category_id";
    return selectQuery(query, props);
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


export { 
    getItems,
    getCategories,
    addProduct,
    addCategory,
    getOneItem,
};