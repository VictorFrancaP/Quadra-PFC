// Importando interfaces a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindChatByParticipantsRepositories } from "../../../domain/repositories/chat/IFindChatByParticipantsRepositories";
import { Chat } from "../../../domain/entities/Chat";
import { prismaClient } from "../../database/db";

export class FindChatByParticipantsRepository
  implements IFindChatByParticipantsRepositories
{
  async findChatByParticipants(
    participantOneId: string,
    participantTwoId: string
  ): Promise<Chat | null> {
    // procurando chat na base de dados
    const findChat = await prismaClient.chat.findUnique({
      where: {
        userOneId_userTwoId: {
          userOneId: participantOneId,
          userTwoId: participantTwoId,
        },
      },
    });

    // caso não encontre, retorna nulo
    if (!findChat) {
      return null;
    }

    // retornando dados encontrados
    return new Chat(
      findChat.userOneId,
      findChat.userTwoId,
      findChat.participantIds,
      findChat.id
    );
  }
}
