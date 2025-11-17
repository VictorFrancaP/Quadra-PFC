// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindChatByIdRepositories } from "../../../domain/repositories/chat/IFIndChatByIdRepositories";
import { Chat } from "../../../domain/entities/Chat";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindChatByIdRepository implements IFindChatByIdRepositories {
  async findChatById(id: string): Promise<Chat | null> {
    // procurando chat no banco de dados
    const findChat = await prismaClient.chat.findFirst({
      where: { id },
    });

    // caso não encontre nenhum, retorna nulo
    if (!findChat) {
      return null;
    }

    // retornando dados encontrados em uma nova entidade
    return new Chat(
      findChat.userOneId,
      findChat.userTwoId,
      findChat.participantIds,
      findChat.id
    );
  }
}
