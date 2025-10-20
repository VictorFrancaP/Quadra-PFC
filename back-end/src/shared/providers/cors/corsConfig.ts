// Importando cors para liberação de acesso do front-end a API
import cors from "cors";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// exportando configuração do cors
export const corsConfig = cors({
  origin: process.env.FRONT_HOST,
  credentials: true,
});
