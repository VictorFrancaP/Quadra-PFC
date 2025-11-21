// Importando cors para liberação de acesso do front-end a API
import cors from "cors";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// carregando variaveis de ambiente com as urls
const FRONT_DEV = process.env.FRONT_HOST;
const FRONT_PROD = process.env.FRONT_HOST_PROD;

// configurando array com os endereços liberados para acesso do cors
const allowedOrigins = [FRONT_DEV, FRONT_PROD].filter(Boolean);

// exportando configuração do cors
export const corsConfig = cors({
  origin: (origin, callback) => {
    // permitindo requisições sem origem como apps mobile e ferramentas como postman
    if (!origin) return callback(null, true);

    // se o endereço estiver incluido na lista, cors libera o acesso
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // se o origem não estiver na lista, acesso negado pelo cors
    callback(new Error("Access Denied by Cors"), false);
  },
  credentials: true,
});
