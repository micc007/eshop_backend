import express, { Express, Request, Response} from "express";
import cors from "cors";
import passport from 'passport';
import * as session from 'express-session';
import mysqlSession from "express-mysql-session";
import routes from './routes';

import dotenv from 'dotenv';
dotenv.config();

let app: Express = express();

app.use(cors({
    credentials: true,
    // origin: [
    //     `${process.env.FRONTEND_SHOP_URL}`,
    //     `${process.env.FRONTEND_SHOP_URL_HTTPS}`
    // ]
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const MySQLStore = mysqlSession(session);

const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    clearExpired: true,
    checkExpirationInterval: 60 * 60 * 1000
})

app.use(session.default({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true,
        secure: false
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.listen(process.env.PORT, () => {
    console.log("app listening");
});