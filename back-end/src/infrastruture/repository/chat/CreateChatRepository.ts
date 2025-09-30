// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { ICreateChatRepositories } from "../../../domain/repositories/chat/ICreateChatRepositories";
import { Chat } from "../../../domain/entities/Chat";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class CreateChatRepository implements ICreateChatRepositories {
  async createChat(chat: Chat): Promise<Chat> {
    // criando chat no banco de dados
    const createdChat = await prismaClient.chat.create({
      data: {
        participantIds: chat.participantIds,
      },
    });

    // retornando dados criados em uma nova entidade
    return new Chat(createdChat.participantIds, createdChat.id);
  }
}
