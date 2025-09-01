// Importando interfaces a serem instânciadas na controller
import { IFindUserOrderRepositories } from "../../../domain/repositories/order/IFindUserOrderRepositories";
import { IRedisProvider } from "../../../shared/providers/redis/provider/IRedisProvider";
import { IEncryptData } from "../../../shared/providers/aes/encrypt/IEncryptData";
import { IUpdateUserOrderRepositories } from "../../../domain/repositories/order/IUpdateUserOrderRepositories";

// Importando interface de dados
import { IUpdateUserOrderDTO } from "../../dtos/order/IUpdateUserOrderDTO";

// Importando error personalizado
import { UserOrderNotFoundError } from "../../../shared/errors/user-error/UserOrderError";
import { UserUpdatedLimitedOrderError } from "../../../shared/errors/user-error/UserOrderError";

// Importando entidade Order
import { Order } from "../../../domain/entities/Order";

// exportando usecase
export class UpdateUserOrderUseCase {
  constructor(
    private readonly findUserOrderRepository: IFindUserOrderRepositories,
    private readonly redisProvider: IRedisProvider,
    private readonly encryptData: IEncryptData,
    private readonly updateUserOrderRepository: IUpdateUserOrderRepositories
  ) {}

  async execute(data: IUpdateUserOrderDTO): Promise<void> {
    // verificando se solicitação do usuário realmente existe
    const userOrder = await this.findUserOrderRepository.findUserOrder(
      data.userId
    );

    // se não existir retorna um erro
    if (!userOrder) {
      throw new UserOrderNotFoundError();
    }

    // criando chave para limitar o usuário de atualizar varias vezes
    const updatedLimited = `pendind_user_update_limited:${userOrder.userId}`;

    // verificando se está armazenada no redis
    const isUpdatedLimited = await this.redisProvider.dataGet(updatedLimited);

    // verificando se a chave ainda está dentro do redis para bloqueio
    if (isUpdatedLimited) {
      throw new UserUpdatedLimitedOrderError();
    }

    // adicionando no redis
    await this.redisProvider.dataSet({
      key: updatedLimited,
      expiration: 300,
      values: {
        value: "true",
      },
    });

    // criando variavel updates
    const updates: Partial<{
      localName: string;
      description: string;
      fone: string;
    }> = {};

    // verificando se valor é undefined
    if (data.localName !== undefined) {
      // mandando para updates
      updates.localName = await this.encryptData.encrypted(data.localName);
    }

    // verificando se valor é undefined
    if (data.description !== undefined) {
      // mandando para updates
      updates.description = await this.encryptData.encrypted(data.description);
    }

    // verificando se valor é undefined
    if (data.fone !== undefined) {
      // mandando para updates
      updates.fone = await this.encryptData.encrypted(data.fone);
    }

    // verificando se usuário não mandou nenhum valor
    if (Object.keys(updates).length === 0) {
      return;
    }

    // mandando metodo estatico do Order
    const updatesUserOrder = Order.updateUserOrder(userOrder, updates);

    // mandando informações do banco de dados
    return await this.updateUserOrderRepository.updateOrder(updatesUserOrder);
  }
}
