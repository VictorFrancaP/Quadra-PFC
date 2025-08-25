// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { ICreateOrderRepositories } from "../../../domain/repositories/order/ICreateOrderRepositories";
import { Order } from "../../../domain/entities/Order";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class CreateOrderRepository implements ICreateOrderRepositories {
  async createOrder(order: Order): Promise<Order> {
    // criando pedido no banco de dados
    const createdOrder = await prismaClient.order.create({
      data: {
        localName: order.localName,
        description: order.description,
        cnpj: order.cnpj,
        fone: order.fone,
        approved: order.approved,
        userId: order.userId,
      },
    });

    // retornando dados da entidade criada
    return new Order(
      createdOrder.localName,
      createdOrder.description,
      createdOrder.cnpj,
      createdOrder.fone,
      createdOrder.approved,
      createdOrder.userId,
      createdOrder.id
    );
  }
}
