import { UserRole } from "./entities/user.entity"

export type UserType = {
    _id: string,
    fName: string,
    lName: string,
    email: string,
    password: string,
    countryCode: string,
    mobile: number,
    role: UserRole,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,

}