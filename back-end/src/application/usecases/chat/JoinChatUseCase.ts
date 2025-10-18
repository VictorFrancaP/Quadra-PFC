// Importando interfaces a serem instânciadas na controller
import { IFindChatByIdRepositories } from "../../../domain/repositories/chat/IFIndChatByIdRepositories";

// Importando interface de dados
import { IJoinChatDTO } from "../../dtos/chat/IJoinChatDTO";

// Importando error personalizado
import { ChatNotFoundError } from "../../../shared/errors/chat-error/ChatNotFoundError";
import { AccessDeniedChatError } from "../../../shared/errors/chat-error/AccessDeniedChatError";

// exportando usecase
export class JoinChatUseCase {
  constructor(
    private readonly findChatByIdRepository: IFindChatByIdRepositories
  ) {}

  async execute(data: IJoinChatDTO): Promise<void> {
    // verificando se o chat existe
    const chat = await this.findChatByIdRepository.findChatById(data.chatId);

    // caso não exista, retorna um erro
    if (!chat) {
      throw new ChatNotFoundError();
    }

    // verificando se o usuário é participante do chat
    if (!chat.participantIds.includes(data.userId)) {
      throw new AccessDeniedChatError();
    }
  }
}
