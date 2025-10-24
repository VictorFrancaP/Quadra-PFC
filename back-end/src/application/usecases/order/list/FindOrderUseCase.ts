// Importando interfaces a serem implementadas e instânciadas na controller
import { IFindUserOrderRepositories } from "../../../../domain/repositories/order/IFindUserOrderRepositories";
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IDecryptData } from "../../../../shared/providers/aes/decrypt/IDecryptData";

// Importando interface de dados
import { IFindOrderUserDTO } from "../../../dtos/order/list/IFindOrderUserDTO";

// Importando entidade Order para ser uma promise(promessa)
import { Order } from "../../../../domain/entities/Order";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { UserOrderNotFoundError } from "../../../../shared/errors/user-error/UserOrderError";

// exportando usecase
export class FindOrderUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findUserOrderRepository: IFindUserOrderRepositories,
    private readonly decryptData: IDecryptData
  ) {}

  async execute(data: IFindOrderUserDTO): Promise<Order> {
    // verificando se usuário existe, na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // procurando solicitação do usuário
    const order = await this.findUserOrderRepository.findUserOrder(data.userId);

    // caso a order não exista, retorna um erro
    if (!order) {
      throw new UserOrderNotFoundError();
    }

    // descriptografando dados vindos do banco de dados
    const localName = await this.decryptData.decrypted(order.localName);
    const description = await this.decryptData.decrypted(order.description);
    const cnpj = await this.decryptData.decrypted(order.cnpj);
    const fone = await this.decryptData.decrypted(order.fone);

    // instânciando entidade Order em novo
    const userOrder = new Order(
      localName,
      description,
      cnpj,
      fone,
      order.status,
      order.userId
    );

    // retornando dados
    return userOrder;
  }
}
