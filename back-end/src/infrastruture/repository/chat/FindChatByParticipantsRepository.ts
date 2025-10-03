// Importando interface a ser implementada e prismaClient para a manipulação do banco de dados
import { IFindChatByParticipantsRepositories } from "../../../domain/repositories/chat/IFindChatByParticipantsRepositories";
import { Chat } from "../../../domain/entities/Chat";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindChatByParticipantsRepository
  implements IFindChatByParticipantsRepositories
{
  async findChatByParticipants(
    participantOneId: string,
    participantTwoId: string
  ): Promise<Chat | null> {
    // procurando chat por participantes
    const findChat = await prismaClient.chat.findFirst({
      where: {
        AND: [
          { participantIds: { has: participantOneId } },
          { participantIds: { has: participantTwoId } },
        ],
      },
    });

    // caso não encontre, retorna nulo
    if (!findChat) {
      return null;
    }

    // retornando dados encontrados em uma nova entidade
    return new Chat(findChat.participantIds, findChat.id);
  }
}
