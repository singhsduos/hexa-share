import express from "express";
import multer from 'multer';
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import File from "../models/File";
import https from "https";
import createEmailTemplate from "../utils/createEmailTemplate";
import sgMail from "@sendgrid/mail";

const router = express.Router();

const storage = multer.diskStorage({});

let upload = multer({
    storage
});

router.post("/upload", upload.single("myFile"), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: "Hello there! We need the file" });

        let uploadedFile: UploadApiResponse;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                folder: "hexaShare",
                resource_type: "auto",
            });

        } catch (error: any) {
            console.log(error.message);
            return res.status(400).json({ message: "Upload Error" });
        }

        const { originalname } = req.file;
        const { secure_url, bytes, format } = uploadedFile;


        const file = await File.create({
            filename: originalname,
            sizeInBytes: bytes,
            secure_url,
            format,
        });

        res.status(200).json({
            id: file._id,
            downloadPageLink: `${process.env.API_BASE_ENDPOINT_CLIENT}download/${file._id}`,
        });

    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ message: "Server Error :(" });
    }
});

//api for searching the file in docs and return the data of file
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: "File does not exist" });
        }

        const { filename, format, sizeInBytes } = file;
        return res.status(200).json({
            name: filename,
            sizeInBytes,
            format,
            id,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server Error :(" });
    }
});

//api for searching the file and then download the file
router.get("/:id/download", async (req, res) => {
    try {
        const id = req.params.id;
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: "File does not exist" });
        }

        https.get(file.secure_url, (fileStream) => fileStream.pipe(res));
    } catch (error) {
        return res.status(500).json({ message: "Server Error :(" });
    }
});

router.post("/email", async (req, res) => {
    //1. validate request
    const { id, emailFrom, emailTo } = req.body;

    if (!id || !emailFrom || !emailTo)
        return res.status(400).json({ message: "all fields are required" });

    // 2. check if the file exists
    const file = await File.findById(id);
    if (!file) {
        return res.status(404).json({ message: "File does not exist" });
    }


    //  3. prepare the e-mail data
    const { filename, sizeInBytes } = file;

    const fileSize = `${(Number(sizeInBytes) / (1024 * 1024)).toFixed(2)} MB `;
    const downloadPageLink = `${process.env.API_BASE_ENDPOINT_CLIENT}download/${id}`;

    const mailOptions = {
        from: emailFrom, // sender address
        to: emailTo, // list of receivers
        subject: "File shared with you", // Subject line
        text: `${emailFrom} shared a file with you`, // plain text body
        html: createEmailTemplate(emailFrom, downloadPageLink, filename, fileSize), // html body
    };


    //  4. send mail using the SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    sgMail
        .send(mailOptions, false, async (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    message: "Mail not sent, due to server error :(",
                });
            }

            file.sender = emailFrom;
            file.receiver = emailTo;
            await file.save();
            return res.status(200).json({
                message: "Email Sent :)",
            });
        });

});


export default router;
