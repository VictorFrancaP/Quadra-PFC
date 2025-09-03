// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IFindUserOrderRepositories } from "../../../domain/repositories/order/IFindUserOrderRepositories";
import { Order } from "../../../domain/entities/Order";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindUserOrderRepository implements IFindUserOrderRepositories {
  async findUserOrder(userId: string): Promise<Order | null> {
    // procurando pedido do usuário
    const userOrder = await prismaClient.order.findFirst({
      where: { userId },
    });

    // caso não encontre nenhum pedido, retorna nulo
    if (!userOrder) {
      return null;
    }

    // retornando dados da entidade encontrada
    return new Order(
      userOrder.localName,
      userOrder.description,
      userOrder.cnpj,
      userOrder.fone,
      userOrder.status,
      userOrder.userId,
      userOrder.id
    );
  }
}
