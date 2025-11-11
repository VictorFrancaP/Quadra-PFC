import { Socket } from "socket.io";
import { FindUserByIdRepository } from "../../../infrastruture/repository/user/FindUserByIdRepository";
import { FindChatsRepository } from "../../../infrastruture/repository/chat/FindChatsRepository";
import { FindUserChatsUseCase } from "../../../application/usecases/chat/FindChatsUseCase";

export class FindUserChatsController {
  private useCase: FindUserChatsUseCase;

  constructor() {
    const findUserByIdRepository = new FindUserByIdRepository();
    const findChatsByUserRepository = new FindChatsRepository();

    this.useCase = new FindUserChatsUseCase(
      findUserByIdRepository,
      findChatsByUserRepository
    );
  }

  async handle(
    socket: Socket,
    _data: unknown,
    callback: (response: {
      chats?: Array<{ id: string; participantIds: string[] }>;
      error?: string;
    }) => void
  ) {
    const userId = socket.data.userId;

    try {
      const chats = await this.useCase.execute({ userId });

      const payload = chats.map((c) => ({
        id: c.id as string,
        participantIds: c.participantIds,
      }));

      callback({ chats: payload });
    } catch (err: any) {
      callback({ error: err.message || "Erro ao listar chats do usuário." });
    }
  }
}
