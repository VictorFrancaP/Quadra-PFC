// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindMessagesByChatIdRepositories } from "../../../domain/repositories/message/IFindMessagesByChatIdRepositories";
import { Message } from "../../../domain/entities/Message";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindMessagesByChatIdRepository
  implements IFindMessagesByChatIdRepositories
{
  async findMessagesByChatId(chatId: string): Promise<Message[]> {
    // procurando mensagens de um chat no banco de dados
    const findMessages = await prismaClient.message.findMany({
      where: {
        chatId,
      },

      orderBy: {
        created_at: "desc",
      },
    });

    // retornando dados encontrados em uma nova entidade
    return findMessages.map(
      (message) =>
        new Message(
          message.content,
          message.senderId,
          message.chatId,
          message.id
        )
    );
  }
}
