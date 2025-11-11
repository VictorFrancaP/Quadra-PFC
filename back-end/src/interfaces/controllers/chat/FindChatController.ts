// Importando Server e Socket do socket.io
import { Socket } from "socket.io";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindChatByParticipantsRepository } from "../../../infrastruture/repository/chat/FindChatByParticipantsRepository";
import { CreateChatRepository } from "../../../infrastruture/repository/chat/CreateChatRepository";

// Importando usecase
import { FindChatUseCase } from "../../../application/usecases/chat/FindChatUseCase";

// exportando controller
export class FindChatController {
  private findChatUseCase: FindChatUseCase;

  constructor() {
    const findUserByIdRepository = new FindUserByIdRepository();
    const findChatByParticipantsRepository =
      new FindChatByParticipantsRepository();
    const createChatRepository = new CreateChatRepository();

    this.findChatUseCase = new FindChatUseCase(
      findUserByIdRepository,
      findChatByParticipantsRepository,
      createChatRepository
    );
  }

  async handle(
    socket: Socket,
    data: { userTwoId: string },
    callback: (response: { chatId?: string; error?: string }) => void
  ) {
    const userId = socket.data.userId;

    try {
      if (!data.userTwoId) {
        throw new Error("ID do destinatário não fornecido.");
      }

      const chat = await this.findChatUseCase.execute({
        userOneId: userId,
        userTwoId: data.userTwoId,
      });

      if (!chat || !chat.id) {
        throw new Error("Não foi possível encontrar ou criar o chat.");
      }

      callback({ chatId: chat.id as string });
    } catch (err: any) {
      console.error(`[FindChatController] Erro: ${err.message}`);
      callback({
        error: err.message || "Erro ao processar busca/criação de chat.",
      });
    }
  }
}
