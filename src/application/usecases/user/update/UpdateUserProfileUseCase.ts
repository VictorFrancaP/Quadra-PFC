// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IRedisProvider } from "../../../../shared/providers/redis/provider/IRedisProvider";
import { IUpdateUserRepositories } from "../../../../domain/repositories/user/IUpdateUserRepositories";

// Importando interface de dados
import { IUpdateUserDTO } from "../../../dtos/user/update/IUpdateUserDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/UserNotFoundError";
import { AddUserProfileInfoError } from "../../../../shared/errors/AddUserProfileInfoError";
import { LimitRatingUpdateProfileUserError } from "../../../../shared/errors/LimitRatingSendMailError";

// Importando entidade User para atualização
import { User } from "../../../../domain/entities/User";

// exportando usecase
export class UpdateUserProfileUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly redisProvider: IRedisProvider,
    private readonly updateUserRepository: IUpdateUserRepositories
  ) {}

  async execute(data: IUpdateUserDTO): Promise<void> {
    // pegando informações do usuário
    const userAlreadyExists = await this.findUserByIdRepository.findUserById(
      data.userId
    );

    // se não encontrar nenhum usuário, retorna um erro
    if (!userAlreadyExists) {
      throw new UserNotFoundError();
    }

    // definindo uma chave para limite de requisição do usuário
    const limitRequest = `pending_user_limited_request:${data.userId}`;

    // verificando se a chave já está armazenada
    const isLimited = await this.redisProvider.dataGet(limitRequest);

    // se estiver no redis, retorna um erro de excesso de requisição
    if (isLimited) {
      throw new LimitRatingUpdateProfileUserError();
    }

    // validando se o usuário entrou pelo google
    const datasIncompletes =
      !userAlreadyExists.age ||
      !userAlreadyExists.address ||
      !userAlreadyExists.cep ||
      !userAlreadyExists.cpf;

    // se alguns dos dados estiverem vazios, entra no if
    if (datasIncompletes) {
      // criando um array para armazenar os dados não preenchidos
      const dataNotFilledIn = [];

      if (!data.age) dataNotFilledIn.push("age");
      if (!data.address) dataNotFilledIn.push("address");
      if (!data.cep) dataNotFilledIn.push("cep");
      if (!data.cpf) dataNotFilledIn.push("cpf");

      if (dataNotFilledIn.length > 0) {
        throw new AddUserProfileInfoError(`${dataNotFilledIn.join(", ")}`);
      }
    }

    // usando metodo estatico para atualização do usuário
    const updates = User.updateUserInfos(userAlreadyExists, {
      name: data.name,
      age: data.age,
      address: data.address,
      cep: data.cep,
      cpf: data.cpf,
    });

    // definindo chave para o usuário no redis
    await this.redisProvider.dataSet({
      key: limitRequest,
      expiration: 120,
      values: { value: "true" },
    });

    // atualizando informações no banco de dados
    return await this.updateUserRepository.updateUser(updates);
  }
}
