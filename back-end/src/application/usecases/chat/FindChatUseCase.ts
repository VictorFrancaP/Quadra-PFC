// Importando interfaces a serem implementadas e instânciadas na controller
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindChatByParticipantsRepositories } from "../../../domain/repositories/chat/IFindChatByParticipantsRepositories";
import { ICreateChatRepositories } from "../../../domain/repositories/chat/ICreateChatRepositories";

// Importando interface de dados
import { IFindChatDTO } from "../../dtos/chat/IFindChatDTO";

// Importando entidade para ser uma promise(promessa)
import { Chat } from "../../../domain/entities/Chat";

// Importando error personalizado
import { ParticipantsIdsSameChatError } from "../../../shared/errors/chat-error/ParticipantsIdsSameChatError";
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { OwnerRequiredChatError } from "../../../shared/errors/chat-error/OwnerRequiredChatError";

// sleep helper
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class FindChatUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findChatByParticipantsRepository: IFindChatByParticipantsRepositories,
    private readonly createChatRepository: ICreateChatRepositories
  ) {}

  async execute(data: IFindChatDTO): Promise<Chat> {
    // verificando se não é o mesmo usuário
    if (data.userOneId === data.userTwoId)
      throw new ParticipantsIdsSameChatError();

    // verificando se o usuário 1 existe na base de dados
    const userOne = await this.findUserByIdRepository.findUserById(
      data.userOneId
    );

    // caso não exista, retorna um erro
    if (!userOne) throw new UserNotFoundError();

    // verificando se o usuário 2 existe na base de dados
    const userTwo = await this.findUserByIdRepository.findUserById(
      data.userTwoId
    );

    // caso não exista, retorna um erro
    if (!userTwo) throw new UserNotFoundError();

    // verificando se um dos dois usuário é proprietario
    if (userOne.role !== "OWNER" && userTwo.role !== "OWNER")
      throw new OwnerRequiredChatError();

    // normalizando criação do chat, evitando duplicação de chats na criação
    const normalizedParticipantIds = [userOne.id!, userTwo.id!].sort();
    const partOne = normalizedParticipantIds[0]!;
    const partTwo = normalizedParticipantIds[1]!;

    // verificando se já existe o chat
    let chat =
      await this.findChatByParticipantsRepository.findChatByParticipants(
        partOne,
        partTwo
      );

    // se não existir, entra no if
    if (!chat) {
      try {
        // criando nova entidade
        const newChat = new Chat(partOne, partTwo, normalizedParticipantIds);

        // criando chat no banco de dados
        chat = await this.createChatRepository.createChat(newChat);
      } catch (error: any) {
        // se der race condicion
        if (error.code === "P2002") {
          // promise helper
          await sleep(100);

          // procurando chat com os participantes
          chat =
            await this.findChatByParticipantsRepository.findChatByParticipants(
              partOne,
              partTwo
            );
        } else {
          // caso não encontre, retorna um erro
          throw error;
        }
      }
    }

    // erro caso não encontre o chat
    if (!chat) {
      throw new Error("Falha crítica ao tentar encontrar ou criar o chat.");
    }

    // retornando chat
    return chat;
  }
}
