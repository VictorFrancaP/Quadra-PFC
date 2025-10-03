// Importando interface a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindChatByIdRepositories } from "../../../domain/repositories/chat/IFIndChatByIdRepositories";
import { IFindMessagesByChatIdRepositories } from "../../../domain/repositories/message/IFindMessagesByChatIdRepositories";

// Importando interfaces de dados
import { IFindMessageInChatDTO } from "../../dtos/message/IFindMessageInChatDTO";

// Importando entidade Message para ser uma promise(promessa)
import { Message } from "../../../domain/entities/Message";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { ChatNotFoundError } from "../../../shared/errors/chat-error/ChatNotFoundError";
import { AccessDeniedChatError } from "../../../shared/errors/chat-error/AccessDeniedChatError";

// exportando usecase
export class FindMessageInChatUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findChatByIdRepository: IFindChatByIdRepositories,
    private readonly findMessagesByChatIdRepository: IFindMessagesByChatIdRepositories
  ) {}

  async execute(data: IFindMessageInChatDTO): Promise<Message[]> {
    // verificando se usuário existe
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // procurando chat por id
    const chat = await this.findChatByIdRepository.findChatById(data.chatId);

    // caso não encontre nenhum chat, retorna um erro
    if (!chat) {
      throw new ChatNotFoundError();
    }

    // verificando se usuário está incluido no chat
    if (!chat.participantIds.includes(user.id as string)) {
      throw new AccessDeniedChatError();
    }

    // procurando mensagens do chat
    const messages =
      await this.findMessagesByChatIdRepository.findMessagesByChatId(
        chat.id as string
      );
      
    // retornando dados esperados
    return messages;
  }
}
