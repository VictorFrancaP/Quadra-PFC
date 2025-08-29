// Importando interface a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindOrderByIdRepositories } from "../../../domain/repositories/order/IFindOrderByIdRepositories";
import { IUpdateUserOrderRepositories } from "../../../domain/repositories/order/IUpdateUserOrderRepositories";

// Importando interface de dados
import { IUpdateUserOrderStatusDTO } from "../../dtos/order/IUpdateUserOrderStatusDTO";

// Importando error personalizado
import { UserOrderNotFoundError } from "../../../shared/errors/UserOrderError";
import { OrderErrorUpdated } from "../../../shared/errors/UserOrderError";
import { UserNotFoundError } from "../../../shared/errors/UserNotFoundError";
import { UserAccessDeniedUpdateError } from "../../../shared/errors/UserAccessDeniedError";

// Importando entidade Order para metodo estatico
import { Order } from "../../../domain/entities/Order";

// exportando usecase
export class UpdateUserOrderStatusUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findOrderByIdRepository: IFindOrderByIdRepositories,
    private readonly updateUserOrderRepository: IUpdateUserOrderRepositories
  ) {}

  async execute(data: IUpdateUserOrderStatusDTO): Promise<void> {
    // verificando usuário que está realizando a requisição
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não encontre, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando se user é ADMIN
    if (user.role !== "ADMIN") {
      throw new UserAccessDeniedUpdateError();
    }

    // procurando pedido (solicitação do usuário) para atualização
    const userOrder = await this.findOrderByIdRepository.findOrder(data.id);

    // se não encontrar nada, retorna um erro
    if (!userOrder) {
      throw new UserOrderNotFoundError();
    }

    // verificando se o status já está aprovado ou negado
    if (userOrder.status === "APPROVED" || userOrder.status === "DENIED") {
      throw new OrderErrorUpdated();
    }

    // utilizando metodo estatico para atualização
    const updatesOrder = Order.updateUserOrder(userOrder, {
      status: data.newStatus,
    });

    // mandando atualização para o banco de dados
    return await this.updateUserOrderRepository.updateOrder(updatesOrder);
  }
}
