import { Router, Request, Response, NextFunction } from 'express'
import getItemsController from './controllers/getItemsController';
import getCategoriesController from './controllers/getCategoriesController';
import addProductController from './controllers/addProductController';
import addCategoryController from './controllers/addCategoryController';
import getEditProductController from './controllers/getEditProductController';
import getEditCategoryController from './controllers/getEditCategoryController';
import postEditProductController from './controllers/postEditProductController';
import postEditCategoryController from './controllers/postEditCategoryController';
import getOneItemController from './controllers/getOneItemController';
import createOrderController from './controllers/createOrderController';
import userLoginController from './controllers/userLoginController';

const route = Router(); 

const message = (): string => {
    let message: string = "tralala";
    return message;
}

route.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send(message());
});

// eshop admin routes

route.post('/add_product', addProductController);

route.post('/add_category', addCategoryController);

route.get('/edit_product', getEditProductController);

route.get('/edit_category', getEditCategoryController);

route.post('/edit_product', postEditProductController);

route.post('/edit_category', postEditCategoryController);

// eshop customer routes

route.get('/get_items', getItemsController);

route.get('/get_categories', getCategoriesController);

route.get('/item/:id', getOneItemController);

route.post('/order', createOrderController);

route.post('/user_login', userLoginController);

export default route;