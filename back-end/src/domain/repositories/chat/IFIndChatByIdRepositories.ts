// Importando entidade Chat para ser uma Promise(promessa)
import { Chat } from "../../entities/Chat";

// exportando interface a ser implementada
export interface IFindChatByIdRepositories {
  findChatById(id: string): Promise<Chat | null>;
}
