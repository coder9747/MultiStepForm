import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import UserRouter from "./Routers/UserRouter";
import FormRouter from "./Routers/FormRouter";
import multer from "multer";



const app = express();


dotenv.config();


app.use(express.json());
app.use(cors());

// app.use('/', (req, res) => res.json('Server Healthy'));

app.use("/api/v1/auth", UserRouter);
app.use("/api/v1/form", FormRouter);













const port = process.env.PORT || 10000;

app.listen(port, () => {
    console.log("Server Running At Port " + port);
})