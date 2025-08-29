// Importando tipos de status da solicitação
import { orderStatus } from "../../../domain/entities/Order";

// exportando interface de dados
export interface IUpdateUserOrderStatusDTO {
  userId: string;
  id: string;
  newStatus: orderStatus;
}
