// Importando Server e Socket do socket.io
import { Server, Socket } from "socket.io";

// Importando interface a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindChatByParticipantsRepository } from "../../../infrastruture/repository/chat/FindChatByParticipantsRepository";
import { CreateChatRepository } from "../../../infrastruture/repository/chat/CreateChatRepository";
import { CreateMessageRepository } from "../../../infrastruture/repository/message/CreateMessageRepository";

// Importando usecases
import { FindChatUseCase } from "../../../application/usecases/chat/FindChatUseCase";
import { CreateMessageUseCase } from "../../../application/usecases/message/CreateMessageUseCase";

// Importando error personalizado
import { ParticipantsIdsSameChatError } from "../../../shared/errors/chat-error/ParticipantsIdsSameChatError";
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { OwnerRequiredChatError } from "../../../shared/errors/chat-error/OwnerRequiredChatError";

// exportando controller
export class SendMessageController {
  constructor(private readonly io: Server) {}

  async handle(
    socket: Socket,
    data: {
      content: string;
      receiverId: string;
    }
  ) {
    // verificando se usuário está logado
    const authUser = socket.data.userId;
    // instânciando interfaces já implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findChatByParticipantsRepository =
      new FindChatByParticipantsRepository();
    const createChatRepository = new CreateChatRepository();
    const createMessageRepository = new CreateMessageRepository();

    // instânciando usecase a ser utilizada como parameter
    const findChatUseCase = new FindChatUseCase(
      findUserByIdRepository,
      findChatByParticipantsRepository,
      createChatRepository
    );

    // instânciando usecase
    const useCase = new CreateMessageUseCase(
      findUserByIdRepository,
      findChatUseCase,
      findChatByParticipantsRepository,
      createChatRepository,
      createMessageRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      // desustruturando dados recebidos da usecase
      const { message, chatId } = await useCase.execute({
        senderId: authUser,
        content: data.content,
        receiverId: data.receiverId,
      });

      // emitindo mensagem apenas para os usuários do chat
      this.io.to(chatId).emit("newMessage", message);
    } catch (err: any) {
      // tratando erros de forma separada

      // caso os ids sejam iguais dos usuários
      if (err instanceof ParticipantsIdsSameChatError) {
        socket.emit("errorMessage", { error: err.message });
      }

      // caso o usuário não exista
      if (err instanceof UserNotFoundError) {
        socket.emit("errorMessage", { error: err.message });
      }

      // caso o proprietario não esteja presente no chat
      if (err instanceof OwnerRequiredChatError) {
        socket.emit("errorMessage", { error: err.message });
      }

      // erro desconhecido
      socket.emit("errorMessage", { error: err.message });
    }
  }
}
