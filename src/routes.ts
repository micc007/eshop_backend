import { Router, Request, Response, NextFunction } from 'express';
import getItemsController from './controllers/product/getItemsController';
import getCategoriesController from './controllers/category/getCategoriesController';
import addProductController from './controllers/product/addProductController';
import addCategoryController from './controllers/category/addCategoryController';
import getEditProductController from './controllers/product/getEditProductController';
import getEditCategoryController from './controllers/category/getEditCategoryController';
import postEditProductController from './controllers/product/postEditProductController';
import postEditCategoryController from './controllers/category/postEditCategoryController';
import getOneItemController from './controllers/product/getOneItemController';
import createOrderController from './controllers/order/createOrderController';
import userLoginController from './controllers/user/userLoginController';
import userRegController from './controllers/user/userRegController';
import userSetDataController from './controllers/user/userSetDataController';
import userActivationController from './controllers/user/userActivationController';
import passRecoveryController from './controllers/user/passRecoveryController';
import setPassController from './controllers/user/setPassController';

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

route.post('/user_reg', userRegController);

route.get('/activate/:token', userActivationController);

route.post('/user/set_data', userSetDataController);

route.post('/pass_recovery', passRecoveryController);

route.post('/set_pass', setPassController);

export default route;