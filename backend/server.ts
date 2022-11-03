import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import fileRoute from "./routes/file";
import { v2 as cloudinary } from "cloudinary";


const app = express();
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_CLOUD,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();

//middleware
app.use(express.json());
app.use(cors());
app.use(
    express.urlencoded({
        extended: true,
    })
); 


app.use("/api/files", fileRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT}`);
})