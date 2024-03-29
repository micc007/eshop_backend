import { regUserDataType } from "./regUserDataType"

export type findUserType = {
    user_id: string,
    email: string,
    pass: string,
    act: number,
    user_data?: regUserDataType | null,
}