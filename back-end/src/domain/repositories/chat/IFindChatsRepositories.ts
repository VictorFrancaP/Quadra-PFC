// Importando entidade Chat para ser uma promise(promessa)
import { Chat } from "../../entities/Chat";

// exportando interface a ser implementada
export interface IFindChatsByUserRepositories {
  findChatsByUser(userId: string): Promise<Chat[]>;
}
