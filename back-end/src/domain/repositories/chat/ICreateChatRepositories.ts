// Importando entidade Chat para ser uma Promise(promessa)
import { Chat } from "../../entities/Chat";

// exportando interface a ser implementada
export interface ICreateChatRepositories {
  createChat(chat: Chat): Promise<Chat>;
}
