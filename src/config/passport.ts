import passport, { DoneCallback } from "passport";
import passportLocal from "passport-local";
// import GoogleStrategy from "passport-google-oauth20");
import bcrypt from "bcrypt";

import dotenv from 'dotenv';
import { findUser } from "./mysql";
import { findUserType } from "../ts/types/user/findUserType";
dotenv.config();

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// })

// passport.deserializeUser((id, done) => {
//     User.findById(id).then((user) => {
//         done(null, user);
//     })
// })

// Local strategy

passport.use(new passportLocal.Strategy({ usernameField: 'email', passwordField: 'password' }, (email: string, password: string, done) => {
    findUser([email])
        .then(async (data) => {
            if(data.length === 0) return done(null, false, {message: "Používateľ neexistuje"});
            const user: findUserType[] = data as findUserType[];

            if(user[0].act !== true) return done(null, false, {message: "Aktivujte svoj účet kliknutím na link vo vašej emailovej schránke"});
            if(await bcrypt.compare(password, user[0].pass)){
                return done(null, user[0]);
            }
            else {
                return done(null, false, {message: "Nesprávne heslo"});
            }

        })
        .catch(err => {
            console.log(err);
            return done(err, false);
        })
    
    })
)