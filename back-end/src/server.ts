// Importando httpServer para iniciar o servidor
import { httpServer } from "./interfaces/app";

// Importando io instância do Server do socket.io
import { io } from "./interfaces/app";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// Importando middleware para validar token do usuário
import { ensureSocketAuth } from "./interfaces/middlewares/ensureSocketAuth";

// Importando instâncias das controllers
import { sendMessageController } from "./interfaces/container";
import { joinChatController } from "./interfaces/container";
import { loadHistoryMessagesController } from "./interfaces/container";

// usando o middleware de autenticação para todas as novas conexões
io.use(ensureSocketAuth);

// registando os handlers de eventos do Socket.IO
io.on("connection", (socket) => {
  socket.on("sendMessage", (data) =>
    sendMessageController.handle(socket, data).catch((err) => {
      console.error(`ERRO NÃO TRATADO em sendMessageController:`, err.message);
    })
  );

  socket.on("joinChat", (data) =>
    joinChatController.handle(socket, data).catch((err) => {
      console.error(`ERRO NÃO TRATADO em joinChatController:`, err.message);
    })
  );

  socket.on("loadHistory", (data) =>
    loadHistoryMessagesController.handle(socket, data).catch((err) => {
      console.error(
        `ERRO NÃO TRATADO em loadHistoryMessagesController:`,
        err.message
      );
    })
  );

  socket.on("disconnect", (reason) => {
    console.log(`Cliente desconectado: ${socket.id} | Razão: ${reason}`);
  });
});

// Criando a variável da porta do servidor
const port = process.env.PORT || 3000;

// Iniciando o servidor
const startingServer = () => {
  try {
    httpServer.listen(port, () => {
      console.log(`Servidor HTTP e WebSocket rodando na porta: ${port}`);
    });
  } catch (err: any) {
    process.exit(1);
  }
};

startingServer();
