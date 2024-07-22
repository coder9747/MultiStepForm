import express, { Router } from "express";
import { loginUser, loginWithProvider, registerUser } from "../Controller/AuthController";

const UserRouter: Router = express.Router();

UserRouter.post("/register", registerUser);
UserRouter.post("/login",loginUser);
UserRouter.post('/loginWithProvider',loginWithProvider);

export default UserRouter;