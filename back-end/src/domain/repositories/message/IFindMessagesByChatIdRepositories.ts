// Importando entidade Message
import { Message } from "../../entities/Message";

// exportando interface a ser implementada
export interface IFindMessagesByChatIdRepositories {
  findMessagesByChatId(chatId: string): Promise<Message[]>;
}
