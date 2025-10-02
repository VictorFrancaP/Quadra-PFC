// Importando interface a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { FindChatUseCase } from "../chat/FindChatUseCase";
import { IFindChatByParticipantsRepositories } from "../../../domain/repositories/chat/IFindChatByParticipantsRepositories";
import { ICreateChatRepositories } from "../../../domain/repositories/chat/ICreateChatRepositories";
import { ICreateMessageRepositories } from "../../../domain/repositories/message/ICreateMessageRepositories";

// Importando interface de dados
import { ICreateMessageDTO } from "../../dtos/message/ICreateMessageDTO";

// Importando entidade Message para ser uma promise(promessa)
import { Message } from "../../../domain/entities/Message";

// Importando error personalizado
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";

// exportando usecase
export class CreateMessageUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findChatUseCase: FindChatUseCase,
    private readonly findChatByParticipantsRepository: IFindChatByParticipantsRepositories,
    private readonly createChatRepository: ICreateChatRepositories,
    private readonly createMessageRepository: ICreateMessageRepositories
  ) {
    this.findChatUseCase = new FindChatUseCase(
      this.findUserByIdRepository,
      this.findChatByParticipantsRepository,
      this.createChatRepository
    );
  }

  async execute(
    data: ICreateMessageDTO
  ): Promise<{ message: Message; chatId: string }> {
    // verificando se usuário-sender existe
    const userSender = await this.findUserByIdRepository.findUserById(
      data.senderId
    );

    // caso não exista, retorna um erro
    if (!userSender) {
      throw new UserNotFoundError();
    }

    // verificando se usuário-receiver existe
    const userReceiver = await this.findUserByIdRepository.findUserById(
      data.receiverId
    );

    // caso não exista, retorna um erro
    if (!userReceiver) {
      throw new UserNotFoundError();
    }

    // verificando se usuário existe, antes de criar uma mensagem
    const chat = await this.findChatUseCase.execute({
      userOneId: data.senderId,
      userTwoId: data.receiverId,
    });

    // criando nova instância da entidade Message
    const newMessage = new Message(
      data.content,
      data.senderId,
      chat.id as string
    );

    // criando mensagem no banco de dados
    const message = await this.createMessageRepository.createdMessage(
      newMessage
    );

    // retornando dados esperados
    return { message, chatId: chat.id as string };
  }
}
