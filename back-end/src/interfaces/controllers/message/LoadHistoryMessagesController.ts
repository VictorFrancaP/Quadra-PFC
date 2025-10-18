// Importando Socket do socket.io
import { Socket } from "socket.io";

// Importando interface implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindChatByIdRepository } from "../../../infrastruture/repository/chat/FindChatByIdRepository";
import { FindMessagesByChatIdRepository } from "../../../infrastruture/repository/message/FindMessagesByChatIdRepository";

// Importando usecase
import { FindMessageInChatUseCase } from "../../../application/usecases/message/FindMessageInChatUseCase";

// Importando error personalizados
import { UserNotFoundError } from "../../../shared/errors/user-error/UserNotFoundError";
import { ChatNotFoundError } from "../../../shared/errors/chat-error/ChatNotFoundError";
import { AccessDeniedChatError } from "../../../shared/errors/chat-error/AccessDeniedChatError";

// exportando controller
export class LoadHistoryMessagesController {
  async handle(
    socket: Socket,
    data: {
      chatId: string;
    }
  ) {
    // verificando se usuário está logado
    const authUser = socket.data.userId;

    // instânciando interfaces implementadas
    const findUserByIdRepository = new FindUserByIdRepository();
    const findChatByIdRepository = new FindChatByIdRepository();
    const findMessagesByChatIdRepository = new FindMessagesByChatIdRepository();

    // instânciando usecase
    const useCase = new FindMessageInChatUseCase(
      findUserByIdRepository,
      findChatByIdRepository,
      findMessagesByChatIdRepository
    );

    // criando try/catch para capturar erros na execução
    try {
      const messages = await useCase.execute({
        userId: authUser,
        chatId: data.chatId,
      });

      socket.emit("chatHistory", messages);
    } catch (err: any) {
      // tratando erros de forma separada

      // erro de caso o usuário não exista
      if (err instanceof UserNotFoundError) {
        socket.emit("errorMessage", { error: err.message });
      }

      // erro de caso o chat não exista
      if (err instanceof ChatNotFoundError) {
        socket.emit("errorMessage", { error: err.message });
      }

      // erro de permissão insuficiente para acessar o chat
      if (err instanceof AccessDeniedChatError) {
        socket.emit("errorMessage", { error: err.message });
      }

      // erro desconhecido
      socket.emit("errorMessage", { error: err.message });
    }
  }
}
