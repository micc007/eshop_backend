import { Request, Response, NextFunction } from "express";
import { regUserData } from '../../config/mysql';
import { regUserDataType } from "../../ts/types/user/regUserDataType";

const userSetDataController = (req: Request, res: Response, next: NextFunction) => {

    const b = req.body;
    
    if(b.userData === undefined || b.user_id === undefined) return res.status(400).send("400 - User data missing");

    const userData: regUserDataType = {
        meno: b.userData.meno,
        priezvisko: b.userData.priezvisko,
        ulica: b.userData.ulica,
        mesto: b.userData.mesto,
        psc: b.userData.psc,
        tel: b.userData.tel,
        email: b.userData.email
    }

    
    const data: [regUserDataType, string] = [userData, b.user_id];
    
    regUserData(data)
        .then(() => {
            return res.status(200).send("User data saved!");
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error");
        });

        
}

export default userSetDataController;