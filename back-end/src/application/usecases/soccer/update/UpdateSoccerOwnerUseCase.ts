// Importando interfaces a serem instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindSoccerOwnerRepositories } from "../../../../domain/repositories/soccer/IFindSoccerOwnerRepositories";
import { IOpenCageProvider } from "../../../../shared/providers/geocoding/IOpenCageProvider";
import { IEncryptData } from "../../../../shared/providers/aes/encrypt/IEncryptData";
import { IUpdateSoccerOwnerRepositories } from "../../../../domain/repositories/soccer/IUpdateSoccerOwnerRepositories";

// Importando interface de dados
import { IUpdateSoccerOwnerDTO } from "../../../dtos/soccer/update/IUpdateSoccerOwnerDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { SoccerAccessDeniedUpdateError } from "../../../../shared/errors/soccer-error/SoccerAccessDeniedError";
import { SoccerNotFoundError } from "../../../../shared/errors/soccer-error/SoccerNotFoundError";

// Importando entidade Soccer para utilização do metodo estatico
import { Soccer } from "../../../../domain/entities/Soccer";

// exportando usecase
export class UpdateSoccerOwnerUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSoccerOwnerRepository: IFindSoccerOwnerRepositories,
    private readonly openCageProvider: IOpenCageProvider,
    private readonly encryptData: IEncryptData,
    private readonly updateSoccerOwnerRepository: IUpdateSoccerOwnerRepositories
  ) {}

  async execute(data: IUpdateSoccerOwnerDTO): Promise<void> {
    // verificando usuário que está fazendo a requisição
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não tenha, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando se usuário é OWNER mesmo
    if (user.role !== "OWNER") {
      throw new SoccerAccessDeniedUpdateError();
    }

    // procurando quadra do proprietário pelo id do usuário
    const userSoccer = await this.findSoccerOwnerRepository.findSoccerOwner(
      user.id as string
    );

    // caso não exista, retorna um erro
    if (!userSoccer) {
      throw new SoccerNotFoundError();
    }

    // pegando dados existentes da quadra
    let latitude = userSoccer.latitude;
    let longitude = userSoccer.longitude;

    // verificando se o dado foi alterado
    if (data.cep && data.cep !== userSoccer.cep) {
      // pegando coordenadas
      const { latitude: lat, longitude: lng } =
        await this.openCageProvider.getCoordinates(data.cep);
      latitude = lat;
      longitude = lng;
    }

    // criptografando dado
    const fone = await this.encryptData.encrypted(data.fone);

    // utilizando metodo estatico para atualização de informações
    const updatesSoccer = Soccer.updateSoccer(userSoccer, {
      name: data.name,
      description: data.description,
      cep: data.cep,
      address: data.address,
      city: data.city,
      state: data.state,
      fone: fone,
      operationDays: data.operationDays,
      openHour: data.openHour,
      closingHour: data.closingHour,
      priceHour: data.priceHour,
      maxDuration: data.maxDuration,
      images: data.images,
      isActive: data.isActive,
      latitude: latitude,
      longitude: longitude,
      observations: data.observations,
    });

    // mandando atualizações para o banco de dados
    return await this.updateSoccerOwnerRepository.updateSoccer(updatesSoccer);
  }
}
