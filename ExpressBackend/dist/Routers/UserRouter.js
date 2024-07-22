"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../Controller/AuthController");
const UserRouter = express_1.default.Router();
UserRouter.post("/register", AuthController_1.registerUser);
UserRouter.post("/login", AuthController_1.loginUser);
UserRouter.post('/loginWithProvider', AuthController_1.loginWithProvider);
exports.default = UserRouter;
