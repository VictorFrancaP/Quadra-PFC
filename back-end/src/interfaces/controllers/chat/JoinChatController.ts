// Importando Server e Socket do socket.io
import { Server, Socket } from "socket.io";

// exportando controller
export class JoinChatController {
  constructor(private readonly io: Server) {}

  async handle(
    request: Request,
    response: Response,
    socket: Socket,
    data: any
  ) {
    // criando try/catch para capturar erros na execução
    try {
      // atributos
      const { chatId } = data;

      // registra sala no socket.io
      socket.join(chatId);

      // mensagem para quando entrar no chat
      socket.emit("joinedChat", { message: "Você entrou no chat!" });
    } catch (err: any) {
      // erro desconhecido
      socket.emit("errorMessage", { error: err.message });
    }
  }
}
