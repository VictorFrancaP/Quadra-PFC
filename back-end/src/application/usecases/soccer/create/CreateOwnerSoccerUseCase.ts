// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindCepSoccerRepositories } from "../../../../domain/repositories/soccer/IFindCepSoccerRepositories";
import { IFindCnpjOwnerSoccerRepositories } from "../../../../domain/repositories/soccer/IFindCnpjOwnerSoccerRepositories";
import { IOpenCageProvider } from "../../../../shared/providers/geocoding/IOpenCageProvider";
import { IFindUserOrderRepositories } from "../../../../domain/repositories/order/IFindUserOrderRepositories";
import { ICreateOwnerSoccerRepositories } from "../../../../domain/repositories/soccer/ICreateOwnerSoccerRepositories";

// Importando interface de dados
import { ICreateOwnerSoccerDTO } from "../../../dtos/soccer/create/ICreateOwnerSoccerDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { UserAccessDeniedSoccerError } from "../../../../shared/errors/user-error/UserAccessDeniedError";
import { SoccerFoundError } from "../../../../shared/errors/soccer-error/SoccerFoundError";
import { UserOrderNotFoundError } from "../../../../shared/errors/user-error/UserOrderError";
import { SoccerCnpjError } from "../../../../shared/errors/soccer-error/SoccerCnpjError";

// Importando entidade Soccer para a promise(promessa)
import { Soccer } from "../../../../domain/entities/Soccer";

// exportando usecase
export class CreateOwnerSoccerUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findCepSoccerRepository: IFindCepSoccerRepositories,
    private readonly findUserOrderRepository: IFindUserOrderRepositories,
    private readonly findCnpjOwnerSoccerRepository: IFindCnpjOwnerSoccerRepositories,
    private readonly openCageProvider: IOpenCageProvider,
    private readonly createOwnerSoccerRepository: ICreateOwnerSoccerRepositories
  ) {}

  async execute(data: ICreateOwnerSoccerDTO): Promise<Soccer> {
    // procurando usuário que está realizando a requisição
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // verificando se usuário existe, caso não exista retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando se usuário tem a permissão de ONWER
    if (user.role === "USER") {
      throw new UserAccessDeniedSoccerError();
    }

    // procurando se a quadra já foi cadastrada
    const soccerAlreadyExists =
      await this.findCepSoccerRepository.findCepSoccer(data.cep);

    // se existir retorna um erro
    if (soccerAlreadyExists) {
      throw new SoccerFoundError();
    }

    // procurando pedido para solicitação de owner
    const userOrder = await this.findUserOrderRepository.findUserOrder(
      user.id as string
    );

    // verificando se existe um pedido
    if (!userOrder) {
      throw new UserOrderNotFoundError();
    }

    // verificando se pedido foi aprovado
    if (userOrder.status !== "APPROVED") {
      throw new UserAccessDeniedSoccerError();
    }

    // procurando cnpj cadastrado nas quadras para verificar se existe outras quadras com o mesmo cnpj
    const userCnpjAlreadyExists =
      await this.findCnpjOwnerSoccerRepository.findCnpjOwner(userOrder.cnpj);

    // caso exista, entra no if
    if (userCnpjAlreadyExists && userCnpjAlreadyExists.length === 1) {
      throw new SoccerCnpjError();
    }

    // pegando coordenadas do usuário
    const { latitude, longitude } = await this.openCageProvider.getCoordinates(
      data.cep
    );

    // cria nova entidade com os dados passados
    const newSoccer = new Soccer(
      data.name,
      data.description,
      data.cep,
      data.address,
      data.city,
      data.state,
      userOrder.cnpj,
      userOrder.fone,
      data.operationDays,
      data.openHour,
      data.closingHour,
      data.priceHour,
      data.maxDuration,
      true,
      data.userId,
      user.name,
      latitude,
      longitude,
      data.ownerPixKey,
      data.observations
    );

    // mandando informações para o banco de dados
    const createdSoccer = await this.createOwnerSoccerRepository.createSoccer(
      newSoccer
    );

    return createdSoccer;
  }
}
