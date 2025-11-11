// Importando interface a ser implementadas nesta classe e prismaClient para a manipulação do banco de dados
import { IFindChatsByUserRepositories } from "../../../domain/repositories/chat/IFindChatsRepositories";
import { Chat } from "../../../domain/entities/Chat";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindChatsRepository implements IFindChatsByUserRepositories {
  async findChatsByUser(userId: string): Promise<Chat[]> {
    // procurando chats do usuário
    const chats = await prismaClient.chat.findMany({
      where: { participantIds: { has: userId } },
      orderBy: { updated_at: "desc" },
    });

    // retornando chats
    return chats.map((c) => new Chat(c.participantIds, c.id));
  }
}
