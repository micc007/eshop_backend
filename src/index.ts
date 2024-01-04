import express, { Express, Request, Response} from "express";
// import cors from "cors";
import routes from './routes';

import dotenv from 'dotenv';
dotenv.config();

let app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);

app.listen(process.env.PORT, () => {
    console.log("app listening");
});