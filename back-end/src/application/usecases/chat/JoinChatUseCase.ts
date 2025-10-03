// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindChatByIdRepositories } from "../../../domain/repositories/chat/IFIndChatByIdRepositories";

// Importando interface de dados
import { IJoinChatDTO } from "../../dtos/chat/IJoinChatDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { ChatNotFoundError } from "../../../shared/errors/chat-error/ChatNotFoundError";

// exportando usecase
export class JoinChatUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findChatByIdRepository: IFindChatByIdRepositories
  ) {}

  async execute(data: IJoinChatDTO) : Promise<void> {
    
  }
}
