// Importando entidade Order para promise(promessa)
import { Order } from "../../entities/Order";

// exportando interface a ser implementada
export interface IFindOrdersRepositories {
  findOrders(): Promise<Order[] | null>;
}
