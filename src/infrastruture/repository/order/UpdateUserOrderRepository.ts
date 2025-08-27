// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IUpdateUserOrderRepositories } from "../../../domain/repositories/order/IUpdateUserOrderRepositories";
import { Order } from "../../../domain/entities/Order";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class UpdateUserOrderRepository implements IUpdateUserOrderRepositories {
  async updateOrder(order: Order): Promise<void> {
    // mandando atualização para o banco de dados
    await prismaClient.order.update({
      where: { id: order.id },
      data: {
        localName: order.localName,
        description: order.description,
        fone: order.fone,
      },
    });
  }
}
