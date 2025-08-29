// Importando entidade Order para a ser a promise(promessa)
import { Order } from "../../entities/Order";

// exportando interface a ser implementada
export interface IFindOrderByIdRepositories {
  findOrder(id: string): Promise<Order | null>;
}
