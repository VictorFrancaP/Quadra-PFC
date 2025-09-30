// Importando entidade Chat para ser uma Promise(promessa)
import { Chat } from "../../entities/Chat";

// exportando interface a ser implementada
export interface IFindChatByParticipantsRepositories {
  findChatByParticipants(
    participantOneId: string,
    participantTwoId: string
  ): Promise<Chat | null>;
}
