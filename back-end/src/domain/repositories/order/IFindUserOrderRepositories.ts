// Importando entidade Order
import { Order } from "../../entities/Order";

// exportando interface a ser implementada
export interface IFindUserOrderRepositories {
  findUserOrder(userId: string): Promise<Order | null>;
}
