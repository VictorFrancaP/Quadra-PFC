// Importando interfaces
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindChatsByUserRepositories } from "../../../domain/repositories/chat/IFindChatsRepositories";

// Importando interface de dados
import { IFindChatsDTO } from "../../dtos/chat/IFindChatsDTO";

// Importando entidade Chat
import { Chat } from "../../../domain/entities/Chat";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";

// exportando usecase
export class FindUserChatsUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findChatsByUserRepository: IFindChatsByUserRepositories
  ) {}

  async execute(data: IFindChatsDTO): Promise<Chat[]> {
    // 1. verificando se usuário existe, na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // 2. caso não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // procurando chats dos proprietarios
    const chats = await this.findChatsByUserRepository.findChatsByUser(
      user.id as string
    );

    // retornando chats encontrados
    return chats;
  }
}
