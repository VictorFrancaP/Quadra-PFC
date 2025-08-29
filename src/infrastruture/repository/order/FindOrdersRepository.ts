// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IFindOrdersRepositories } from "../../../domain/repositories/order/IFindOrdersRepositories";
import { Order } from "../../../domain/entities/Order";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindOrdersRepository implements IFindOrdersRepositories {
  async findOrders(): Promise<Order[] | null> {
    // procurando pedidos (solicitações dos usuários para virarem OWNER(PROPRIETÁRIOS))
    const orders = await prismaClient.order.findMany();

    // se não encontrar nenhum, retorna nulo
    if (!orders.length) {
      return null;
    }

    // retornando dados
    return orders.map(
      (order) =>
        new Order(
          order.localName,
          order.description,
          order.cnpj,
          order.fone,
          order.status,
          order.userId
        )
    );
  }
}
