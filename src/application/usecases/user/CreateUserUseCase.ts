// Importando interfaces a serem instânciadas
import { IFindUserByCPFRepositories } from "../../../domain/repositories/user/IFindUserByCPFRepositories";
import { IRedisProvider } from "../../../shared/providers/redis/provider/IRedisProvider";
import { IHashProvider } from "../../../shared/providers/bcrypt/hash/IHashProvider";
import { IMailProvider } from "../../../shared/providers/mail/provider/IMailProvider";
import { ICreateUserRepositories } from "../../../domain/repositories/user/ICreateUserRepositories";

// Importando interface de dados
import { ICreateUserDTO } from "../../dtos/user/ICreateUserDTO";

// Importando entidade User para ser uma Promise(promessa)
import { User } from "../../../domain/entities/User";

// Importando classe de erro personalizada
import { UserFoundError } from "../../../shared/errors/UserFoundError";
import { UserNotFoundError } from "../../../shared/errors/UserNotFoundError";

// Importando template de boas-vindas
import { welcomeTemplate } from "../../../shared/providers/templates/WelcomeTemplate";

// exportando classe de usecase
export class CreateUserUseCase {
  constructor(
    private readonly findUserByCPFRepository: IFindUserByCPFRepositories,
    private readonly redisProvider: IRedisProvider,
    private readonly hashProvider: IHashProvider,
    private readonly createUserRepository: ICreateUserRepositories,
    private readonly mailProvider: IMailProvider,
  ) {}

  async execute(data: ICreateUserDTO): Promise<User> {
    // verificando se o CPF não está cadastrado no banco de dados
    const userAlreadyExists = await this.findUserByCPFRepository.findUserByCPF(
      data.cpf
    );

    // se o CPF estiver cadastrado, retorna um erro
    if (userAlreadyExists) {
      throw new UserFoundError("CPF");
    }

    // capturando dados do redis (cache)
    const dataUser = await this.redisProvider.dataGet(
      `pending_user_created:${data.token}`
    );

    // caso não retorne nenhum dado, ocorre um erro
    if (!dataUser) {
      throw new UserNotFoundError();
    }

    // pegando os dados guardados no cache (redis)
    const { name, email } = JSON.parse(dataUser);

    // criptografando senha
    const hashedPassword = await this.hashProvider.hashPassword(data.password);

    // criando novo usuário por meio da entidade User
    const newUser = new User(
      name,
      email,
      hashedPassword,
      data.age,
      "USER",
      data.address,
      data.cep,
      data.cpf,
      data.gender
    );

    // criando novo usuário no banco de dados
    const createUser = await this.createUserRepository.createUser(newUser);

    // deletando dados no cache (redis)
    await this.redisProvider.dataDelete(`pending_user_created:${data.token}`);

    await this.mailProvider.send({
      email: createUser.email,
      content: welcomeTemplate(createUser.name),
      subject: `Bem-vindo ao nosso sistema de aluguel de quadras!`,
    });

    // retornando usuário criado
    return createUser;
  }
}
