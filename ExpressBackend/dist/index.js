"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const UserRouter_1 = __importDefault(require("./Routers/UserRouter"));
const FormRouter_1 = __importDefault(require("./Routers/FormRouter"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// app.use('/', (req, res) => res.json('Server Healthy'));
app.use("/api/v1/auth", UserRouter_1.default);
app.use("/api/v1/form", FormRouter_1.default);
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log("Server Running At Port " + port);
});
