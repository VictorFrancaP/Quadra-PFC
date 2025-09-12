// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IDecryptData } from "../../../../shared/providers/aes/decrypt/IDecryptData";
import { IFindOrdersRepositories } from "../../../../domain/repositories/order/IFindOrdersRepositories";

// Importando interface de dados
import { IFindOrdersDTO } from "../../../dtos/order/list/IFindOrdersDTO";

// Importando entidade Order para ser a Promise(promessa)
import { Order } from "../../../../domain/entities/Order";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { UsersAccessDeniedError } from "../../../../shared/errors/user-error/UserAccessDeniedError";
import { UsersOrdersNotFoundError } from "../../../../shared/errors/user-error/UserOrderError";

// exportando usecase
export class FindOrdersUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findOrdersRepository: IFindOrdersRepositories,
    private readonly decryptData: IDecryptData
  ) {}

  async execute(data: IFindOrdersDTO): Promise<Order[]> {
    // procurando usuário que está fazendo a requisição
    const userRequest = await this.findUserByIdRepository.findUserById(
      data.userId
    );

    // se não encontrar nenhum usuário, retorna um erro
    if (!userRequest) {
      throw new UserNotFoundError();
    }

    // verificando se o usuário é ADMIN
    if (userRequest.role !== "ADMIN") {
      throw new UsersAccessDeniedError();
    }

    // procurando pedidos (solicitações dos usuários para virarem OWNER(PROPRIETÁRIO))
    const orders = await this.findOrdersRepository.findOrders();

    // se não encontrar nenhuma, retorna um erro
    if (!orders || !orders.length) {
      throw new UsersOrdersNotFoundError();
    }

    // descriptografando dados do array
    const decryptedOrders = await Promise.all(
      orders.map(async (order) => {
        return new Order(
          await this.decryptData.decrypted(order.localName),
          await this.decryptData.decrypted(order.description),
          await this.decryptData.decrypted(order.cnpj),
          await this.decryptData.decrypted(order.fone),
          order.status,
          order.userId
        );
      })
    );

    // retornando array com os pedidos (solicitações)
    return decryptedOrders;
  }
}
