// CreateChatRepository.ts
import { ICreateChatRepositories } from "../../../domain/repositories/chat/ICreateChatRepositories";
import { Chat } from "../../../domain/entities/Chat";
import { prismaClient } from "../../database/db";

export class CreateChatRepository implements ICreateChatRepositories {
  async createChat(chat: Chat): Promise<Chat> {
    // criando chat no banco de dados
    const createdChat = await prismaClient.chat.create({
      data: {
        userOneId: chat.userOneId,
        userTwoId: chat.userTwoId,
        participantIds: chat.participantIds,
      },
    });

    // retornando os dados em nova entidade
    return new Chat(
      createdChat.userOneId,
      createdChat.userTwoId,
      createdChat.participantIds,
      createdChat.id
    );
  }
}
