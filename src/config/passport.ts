import passport, { DoneCallback } from "passport";
import LocalStrategy from "passport-local";
// import GoogleStrategy from "passport-google-oauth20");
import bcrypt from "bcrypt";

import dotenv from 'dotenv';
import { findUser, findUserById } from "./mysql";
import { findUserType } from "../ts/types/user/findUserType";
import { userResponseType } from "../ts/types/user/userResponseType";
dotenv.config();

// Local strategy

passport.use('local', new LocalStrategy.Strategy({ usernameField: 'email', passwordField: 'password' }, (email: string, password: string, done) => {
    findUser([email])
    .then(async (data) => {
        if(data.length === 0) return done(null, false, {message: "Používateľ neexistuje"});
        const user: findUserType = data[0] as findUserType;
        
        if(user.act !== 1) return done(null, false, {message: "Aktivujte svoj účet kliknutím na link vo vašej emailovej schránke"});
        if(await bcrypt.compare(password, user.pass)){
            const userData: userResponseType = {
                user_id: user.user_id,
                email: user.email,
                user_data: user.user_data
            }
            return done(null, userData);
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

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user: findUserType, done) => {
    // User.findById(id).then((user) => {
    //     done(null, user);
    // })

    findUserById([user.user_id])
        .then((data) => {
            const user: findUserType = data[0] as findUserType;
            done(null, user);
        })

})

export default passport;

