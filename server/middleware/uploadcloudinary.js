import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bizora",
    allowed_formats: ["jpg", "png", "jpeg", "webp"]
  }
});

const uploadCloudinary = multer({ storage });

export default uploadCloudinary;