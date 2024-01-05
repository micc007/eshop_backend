import { Router, Request, Response, NextFunction } from 'express'
import getItemsController from './controllers/getItemsController';
import getCategoriesController from './controllers/getCategoriesController';
import addProductController from './controllers/addProductController';
import addCategoryController from './controllers/addCategoryController';
import getOneItemController from './controllers/getOneItemController';

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

// eshop customer routes

route.get('/get_items', getItemsController);
route.get('/get_categories', getCategoriesController);

route.get('/item/:id', getOneItemController);

route.post('/order');



export default route;