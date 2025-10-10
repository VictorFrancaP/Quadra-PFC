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
  // eventos do socket.io
  socket.on("sendMessage", (data) =>
    sendMessageController.handle(socket, data)
  );

  socket.on("joinChat", (data) => joinChatController.handle(socket, data));

  socket.on("loadHistory", (data) =>
    loadHistoryMessagesController.handle(socket, data)
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
    console.log("Iniciando servidor...");
    httpServer.listen(port, () => {
      setTimeout(() => {
        console.log(`Servidor http e websocket rodando na porta: ${port}`);
      }, 1000);
    });
  } catch (err: any) {
    process.exit(1);
  }
};

startingServer();
