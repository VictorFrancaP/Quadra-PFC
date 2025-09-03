// Importando cloudinary, multer e CloudinaryStorage para configuração do cloudinary
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// criando configuração do cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// definindo pastas e tipos de formatos de imagens
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile-users",
    formats: ["jpg", "jpeg", "png"],
  } as any,
});

// exportando multer da updateImage
export const updateImage = multer({ storage });
