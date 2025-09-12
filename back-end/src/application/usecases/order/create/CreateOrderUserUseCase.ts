// Importando interfaces a serem instânciadas na controller
import { IFindUserOrderRepositories } from "../../../../domain/repositories/order/IFindUserOrderRepositories";
import { IFindUserCnpjOrderRepositories } from "../../../../domain/repositories/order/IFindUserCnpjOrderRepositories";
import { IEncryptData } from "../../../../shared/providers/aes/encrypt/IEncryptData";
import { ICreateOrderRepositories } from "../../../../domain/repositories/order/ICreateOrderRepositories";

// Importando interface de dados
import { ICreateOrderDTO } from "../../../dtos/order/create/ICreateOrderDTO";

// Importando entidade Order para a ser Promise(promessa)
import { Order } from "../../../../domain/entities/Order";

// Importando error personalizado
import { UserOrderError } from "../../../../shared/errors/user-error/UserOrderError";
import { UserOrderCnpjError } from "../../../../shared/errors/user-error/UserOrderError";

// exportando usecase
export class CreateOrderUserUseCase {
  constructor(
    private readonly findUserCnpjOrderRepository: IFindUserCnpjOrderRepositories,
    private readonly findUserOrderRepository: IFindUserOrderRepositories,
    private readonly encryptData: IEncryptData,
    private readonly createOrderRepository: ICreateOrderRepositories
  ) {}

  async execute(data: ICreateOrderDTO): Promise<Order> {
    // verificando se CNPJ já está sendo utilizado
    const cnpjAlreadyExists =
      await this.findUserCnpjOrderRepository.findUserCnpj(data.cnpj);

    // se existir retorna um erro
    if (cnpjAlreadyExists) {
      throw new UserOrderCnpjError();
    }

    // verificando se usuário já realizou um pedido (solicitação)
    const userOrderAlreadyExists =
      await this.findUserOrderRepository.findUserOrder(data.userId);

    // se existir retorna um erro
    if (userOrderAlreadyExists) {
      throw new UserOrderError();
    }

    // criptografando dados
    const localName = await this.encryptData.encrypted(data.localName);
    const description = await this.encryptData.encrypted(data.description);
    const cnpj = await this.encryptData.encrypted(data.cnpj);
    const fone = await this.encryptData.encrypted(data.fone);

    // criando entidade de pedido (solicitação)
    const newOrder = new Order(
      localName,
      description,
      cnpj,
      fone,
      "PENDING",
      data.userId
    );

    // enviando criação para o banco de dados
    const createdOrder = await this.createOrderRepository.createOrder(newOrder);

    // retornando pedido criado
    return createdOrder;
  }
}
