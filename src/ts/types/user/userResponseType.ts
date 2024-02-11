import { regUserDataType } from "./regUserDataType"

export type userResponseType = {
    user_id: string,
    email: string,
    user_data?: regUserDataType | null,
}