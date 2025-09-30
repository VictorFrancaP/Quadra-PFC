// Importando entidade Message para ser uma Promise(promessa)
import { Message } from "../../entities/Message";

// exportando interface a ser implementada
export interface ICreateMessageRepositories {
  createdMessage(message: Message): Promise<Message>;
}
