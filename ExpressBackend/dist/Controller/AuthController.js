"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithProvider = exports.loginUser = exports.registerUser = void 0;
const Db_config_1 = __importDefault(require("../Db/Db.config"));
const bcrypt_1 = require("bcrypt");
const HelperAuth_1 = require("../Helpers/HelperAuth");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const { email, password } = req.body;
    //simple validation
    if (!email || !password) {
        const response = { succes: false, message: "Credentials Required" };
        return res.json(response);
    }
    try {
        const isUserExits = yield Db_config_1.default.user.findFirst({
            where: { email }
        });
        //if user already registered
        if (isUserExits) {
            const response = { succes: false, message: "Email Already Taken" };
            return res.json(response);
        }
        //hashing a password and creating a new user
        const hashPassword = yield (0, bcrypt_1.hash)(password, 12);
        let newUser = yield Db_config_1.default.user.create({
            data: {
                email,
                password: hashPassword,
            }
        });
        const payload = (0, HelperAuth_1.userWithoutPasswored)(newUser);
        const response = { succes: true, message: "User Registered Succesful", payload };
        return res.json(response);
    }
    catch (error) {
        const response = { succes: false, message: "Server Error" };
        res.json(response);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        const response = { succes: false, message: "Credentials Required" };
        return res.json(response);
    }
    try {
        const isUserExits = yield Db_config_1.default.user.findFirst({
            where: {
                email,
            }
        });
        if (!isUserExits) {
            const response = { succes: false, message: "Email No Registered" };
            return res.json(response);
        }
        ;
        const isPasswordCorrect = yield (0, bcrypt_1.compare)(password, isUserExits.password);
        if (!isPasswordCorrect) {
            const response = { succes: false, message: "Invalid Credentials" };
            return res.json(response);
        }
        const payload = (0, HelperAuth_1.userWithoutPasswored)(isUserExits);
        const response = { succes: true, message: "Logged In Succes", payload };
        return res.json(response);
    }
    catch (error) {
        const response = { succes: false, message: "Server Error" };
        return res.json(response);
    }
});
exports.loginUser = loginUser;
const loginWithProvider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, type } = req.body;
    try {
        const isUserExists = yield Db_config_1.default.user.findUnique({
            where: { email }
        });
        if (isUserExists) {
            return res.json({ succes: true, message: "loggedIn Succes", payload: isUserExists });
        }
        ;
        const newUser = yield Db_config_1.default.user.create({
            data: {
                email,
                type,
            }
        });
        return res.json({ succes: true, message: "Logged In Succes", payload: newUser });
    }
    catch (error) {
        return res.json({ succes: false, message: "Server Error" });
    }
});
exports.loginWithProvider = loginWithProvider;
