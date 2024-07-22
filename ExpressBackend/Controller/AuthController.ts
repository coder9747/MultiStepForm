import prisma from "../Db/Db.config";
import { Request, response, Response } from "express";
import { compare, hash } from "bcrypt";
import { userWithoutPasswored } from "../Helpers/HelperAuth";

interface UserData {
    email: string,
    password: string,
}
interface ResponseType {
    succes: boolean,
    message: string,
    payload?: any,
}



export const registerUser = async (req: Request, res: Response) => {
    //@ts-ignore
    const { email, password }: UserData = req.body;
    //simple validation
    if (!email || !password) {
        const response: ResponseType = { succes: false, message: "Credentials Required" };
        return res.json(response)
    }
    try {
        const isUserExits = await prisma.user.findFirst({
            where: { email }
        });
        //if user already registered
        if (isUserExits) {
            const response: ResponseType = { succes: false, message: "Email Already Taken" };
            return res.json(response);
        }
        //hashing a password and creating a new user
        const hashPassword = await hash(password, 12);
        let newUser = await prisma.user.create({
            data: {
                email,
                password: hashPassword,
            }
        });
        const payload = userWithoutPasswored(newUser);
        const response: ResponseType = { succes: true, message: "User Registered Succesful", payload };
        return res.json(response);


    } catch (error) {
        const response = { succes: false, message: "Server Error" } as ResponseType
        res.json(response);
    }
}
export const loginUser = async (req: Request, res: Response) => {
    const { email, password }: UserData = req.body;
    if (!email || !password) {
        const response: ResponseType = { succes: false, message: "Credentials Required" };
        return res.json(response)
    }
    try {
        const isUserExits = await prisma.user.findFirst({
            where: {
                email,
            }
        });
        if (!isUserExits) {
            const response: ResponseType = { succes: false, message: "Email No Registered" };
            return res.json(response);
        };
        const isPasswordCorrect = await compare(password, isUserExits.password as string);
        if (!isPasswordCorrect) {
            const response = { succes: false, message: "Invalid Credentials" };
            return res.json(response);
        }
        const payload = userWithoutPasswored(isUserExits);
        const response: ResponseType = { succes: true, message: "Logged In Succes", payload };
        return res.json(response);
    } catch (error) {
        const response: ResponseType = { succes: false, message: "Server Error" };
        return res.json(response);
    }
}
export const loginWithProvider = async (req: Request, res: Response) => {
    const { email, type } = req.body;
    try {
        const isUserExists = await prisma.user.findUnique({
            where: { email }
        });
        if (isUserExists) {
            return res.json({ succes: true, message: "loggedIn Succes", payload: isUserExists });
        };
        const newUser = await prisma.user.create({
            data: {
                email,
                type,
            }
        });
        return res.json({ succes: true, message: "Logged In Succes", payload: newUser });

    } catch (error) {
        return res.json({ succes: false, message: "Server Error" });
    }

}