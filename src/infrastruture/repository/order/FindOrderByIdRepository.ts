// Importando interface a ser implementada nesta classe e prismaClient para a manipulação do banco de dados
import { IFindOrderByIdRepositories } from "../../../domain/repositories/order/IFindOrderByIdRepositories";
import { Order } from "../../../domain/entities/Order";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class FindOrderByIdRepository implements IFindOrderByIdRepositories {
  async findOrder(id: string): Promise<Order | null> {
    // procurando pedido (solicitação do usuário) de acordo com id
    const orderFind = await prismaClient.order.findFirst({
      where: { id },
    });

    // se não encontrar nada, retorna nulo
    if (!orderFind) {
      return null;
    }

    // retornando dados encontrados em uma nova instância
    return new Order(
      orderFind.localName,
      orderFind.description,
      orderFind.cnpj,
      orderFind.fone,
      orderFind.status,
      orderFind.userId,
      orderFind.id
    );
  }
}
