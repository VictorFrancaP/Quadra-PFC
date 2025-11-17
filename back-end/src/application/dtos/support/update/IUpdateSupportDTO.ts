// Importando tipos de status de suporte
import { supportStatus } from "../../../../domain/entities/Support";

// exportando interface de dados
export interface IUpdateSupportDTO {
  userId: string;
  id: string;
  newStatus: supportStatus;
}
