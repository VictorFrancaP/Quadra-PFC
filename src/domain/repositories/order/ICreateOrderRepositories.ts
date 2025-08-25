// Importando entidade Order
import { Order } from "../../entities/Order";

// exportando interface a ser implementada
export interface ICreateOrderRepositories {
  createOrder(order: Order): Promise<Order>;
}
