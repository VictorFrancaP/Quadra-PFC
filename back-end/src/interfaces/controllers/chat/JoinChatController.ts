// Importando Server e Socket do socket.io
import { Socket } from "socket.io";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindChatByIdRepository } from "../../../infrastruture/repository/chat/FindChatByIdRepository";

// Importando usecase
import { JoinChatUseCase } from "../../../application/usecases/chat/JoinChatUseCase";

// Importando error personalizado
import { ChatNotFoundError } from "../../../shared/errors/chat-error/ChatNotFoundError";
import { AccessDeniedChatError } from "../../../shared/errors/chat-error/AccessDeniedChatError";

// exportando controller
export class JoinChatController {
  async handle(
    socket: Socket,
    data: {
      chatId: string;
    }
  ) {
    // criando try/catch para capturar erros na execução
    try {
      // usuário logado
      const authUser = socket.data.userId;

      // instânciando interfaces implementadas
      const findChatByIdRepository = new FindChatByIdRepository();

      // instânciando usecase
      const useCase = new JoinChatUseCase(findChatByIdRepository);

      // esperando execução da usecase para verificar se existe algum erro
      await useCase.execute({ chatId: data.chatId, userId: authUser });

      // registra sala no socket.io
      socket.join(data.chatId);

      // emitindo confirmação para o cliente
      socket.emit("joinedChat", { message: "Você entrou no chat!" });

      // mensagem para quando entrar no chat
      socket.emit("joinedChat", { message: "Você entrou no chat!" });
    } catch (err: any) {
      // tratando erros de forma separada

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
