// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindChatByParticipantsRepositories } from "../../../domain/repositories/chat/IFindChatByParticipantsRepositories";
import { ICreateChatRepositories } from "../../../domain/repositories/chat/ICreateChatRepositories";

// Importando interface de dados
import { IFindChatDTO } from "../../dtos/chat/IFindChatDTO";

// Importando entidade Chat para ser uma promise(promessa)
import { Chat } from "../../../domain/entities/Chat";

// Importando error personalizado
import { ParticipantsIdsSameChatError } from "../../../shared/errors/chat-error/ParticipantsIdsSameChatError";
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { OwnerRequiredChatError } from "../../../shared/errors/chat-error/OwnerRequiredChatError";

// exportando usecase
export class FindChatUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findChatByParticipantsRepository: IFindChatByParticipantsRepositories,
    private readonly createChatRepository: ICreateChatRepositories
  ) {}

  async execute(data: IFindChatDTO): Promise<Chat> {
    // verificando se os ids são iguais, caso seja retorna um erro
    if (data.userOneId === data.userTwoId) {
      throw new ParticipantsIdsSameChatError();
    }

    // verificando se usuário-1 existe
    const userOne = await this.findUserByIdRepository.findUserById(
      data.userOneId
    );

    // caso não exista, retorna um erro
    if (!userOne) {
      throw new UserNotFoundError();
    }

    // verificando se usuário-2 existe
    const userTwo = await this.findUserByIdRepository.findUserById(
      data.userTwoId
    );

    // caso não existe, retorna um erro
    if (!userTwo) {
      throw new UserNotFoundError();
    }

    // verificando se os dois usuários contém a role USER
    if (userOne.role !== "OWNER" && userTwo.role !== "OWNER") {
      throw new OwnerRequiredChatError();
    }

    // procurando chat dos participantes
    let chat =
      await this.findChatByParticipantsRepository.findChatByParticipants(
        userOne.id!,
        userTwo.id!
      );

    // caso não exista chat, um novo chat é criado
    if (!chat) {
      // variavel de participantes
      const participantIds = [userOne.id!, userTwo.id!].sort();

      // criando nova instância da entidade Chat
      const newChat = new Chat(participantIds);

      // criando novo chat no banco de dados
      chat = await this.createChatRepository.createChat(newChat);
    }

    // retornando chat
    return chat;
  }
}
