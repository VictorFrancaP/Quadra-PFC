// Importando cloudinary, multer e CloudinaryStorage para configuração do cloudinary
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer, { Multer } from "multer";

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

// definindo pastas e tipos de formatos de imagens
const soccerStorage = new CloudinaryStorage({
  cloudinary,
  params: async (request, response) => {
    const soccerId = request.params.id;

    return {
      folder: `soccers/${soccerId || `unsorted`}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };
  },
});

// exportando nova instância do multer para quadras
export const updateSoccerImages: Multer = multer({
  storage: soccerStorage,
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 5,
  },
  fileFilter: (request, file, callback) => {
    const allowedMimes = [`image/jpg`, `image/jpeg`, `image/png`, `image/webp`];
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error("Formato inválido. Apenas imagens (JPG, PNG, JPEG ou WEBP")
      );
    }
  },
});
