// Importando io do socket.io para ser usado como parametro
import { io } from "../app";

// Importando controllers para ser instânciadas
import { SendMessageController } from "../controllers/message/SendMessageController";
import { JoinChatController } from "../controllers/chat/JoinChatController";
import { LoadHistoryMessagesController } from "../controllers/message/LoadHistoryMessagesController";

// instânciando controllers
const sendMessageController = new SendMessageController(io);
const joinChatController = new JoinChatController();
const loadHistoryMessagesController = new LoadHistoryMessagesController();

// exportando controllers
export {
  sendMessageController,
  joinChatController,
  loadHistoryMessagesController,
};
