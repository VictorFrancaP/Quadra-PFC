// Importando app
import { app } from "./interfaces/app";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// criando variavel da porta do servidor
const port = process.env.PORT || 5500;

// criando arrow function para iniciar o servidor
const startingServer = async () => {
  // criando try/catch para capturar erros na execução
  try {
    console.log("Iniciando...");
    app.listen(port, () => {
      setTimeout(() => {
        console.log(`Servidor rodando na porta: ${port}`);
      }, 1000);
    });
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

// chamando arrow function para execução
startingServer();
