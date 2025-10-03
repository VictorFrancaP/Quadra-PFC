// importando interface a ser implementada e prismaClient para a manipulação do banco de dados
import { ICreateMessageRepositories } from "../../../domain/repositories/message/ICreateMessageRepositories";
import { Message } from "../../../domain/entities/Message";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class CreateMessageRepository implements ICreateMessageRepositories {
  async createdMessage(message: Message): Promise<Message> {
    // criando mensagem no banco de dados
    const createdMessage = await prismaClient.message.create({
      data: {
        content: message.content,
        sender: {
          connect: {
            id: message.senderId,
          },
        },
        chat: {
          connect: {
            id: message.chatId,
          },
        },
      },
    });

    // retornando dados criados em uma nova entidade
    return new Message(
      createdMessage.content,
      createdMessage.senderId,
      createdMessage.chatId,
      createdMessage.id
    );
  }
}
