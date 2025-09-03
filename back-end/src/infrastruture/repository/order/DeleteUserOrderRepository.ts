// Importando interface a ser implementada nesta classe e prismaClient para manipulação do banco de dados
import { IDeleteUserOrderRepositories } from "../../../domain/repositories/order/IDeleteUserOrderRepositories";
import { prismaClient } from "../../database/db";

// exportando classe de implementação de interface
export class DeleteUserOrderRepository implements IDeleteUserOrderRepositories {
  async deleteOrder(id: string): Promise<void> {
    // deletando pedido (solicitação do usuário) do banco de dados
    await prismaClient.order.delete({
      where: { id },
    });
  }
}
