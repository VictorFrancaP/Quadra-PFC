// Importando interfaces a serem implementadas e instânciadas na controller
import { IFindUserByIdRepositories } from "../../../../domain/repositories/user/IFindUserByIdRepositories";
import { IFindSoccerByIdRepositories } from "../../../../domain/repositories/soccer/IFindSoccerByIdRepositories";
import { IUpdateSoccerOwnerRepositories } from "../../../../domain/repositories/soccer/IUpdateSoccerOwnerRepositories";

// Importando interface de dados
import { IUploadSoccerImagesDTO } from "../../../dtos/soccer/images-soccer/IUploadSoccerImagesDTO";

// Importando interface de resposta
import { IUploadSoccerImagesResponseDTO } from "../../../dtos/soccer/images-soccer/IUploadSoccerImagesResponseDTO";

// Importando error personalizado
import { UserNotFoundError } from "../../../../shared/errors/user-error/UserNotFoundError";
import { SoccerNotFoundError } from "../../../../shared/errors/soccer-error/SoccerNotFoundError";
import { UserAccessDeniedSoccerError } from "../../../../shared/errors/user-error/UserAccessDeniedError";
import { SoccerAccessDeniedUpdateError } from "../../../../shared/errors/soccer-error/SoccerAccessDeniedError";
import { SoccerImagesError } from "../../../../shared/errors/soccer-error/SoccerImagesError";
import { SoccerImagesLimitedError } from "../../../../shared/errors/soccer-error/SoccerImagesLimitedError";

// Importando entidade Soccer para atualização do metodo estatico
import { Soccer } from "../../../../domain/entities/Soccer";

// exportando usecase
export class UploadSoccerImagesUseCase {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepositories,
    private readonly findSoccerByIdRepository: IFindSoccerByIdRepositories,
    private readonly updateSoccerOwnerRepository: IUpdateSoccerOwnerRepositories
  ) {}

  async execute(
    data: IUploadSoccerImagesDTO
  ): Promise<IUploadSoccerImagesResponseDTO> {
    // verificando se usuário existe, na base de dados
    const user = await this.findUserByIdRepository.findUserById(data.userId);

    // caso não exista, retorna um erro
    if (!user) {
      throw new UserNotFoundError();
    }

    // verificando se quadra exista, na base de dados
    const soccer = await this.findSoccerByIdRepository.findSoccerById(
      data.soccerId
    );

    // caso não exista, retorna um erro
    if (!soccer) {
      throw new SoccerNotFoundError();
    }

    // verificando se o usuário não é admin
    if (user.role === "USER") {
      throw new UserAccessDeniedSoccerError();
    }

    // verificando se o proprietario é o dono mesmo
    if (user.id !== soccer.userId) {
      throw new SoccerAccessDeniedUpdateError();
    }

    // verificando se vieram imagens para salvar
    if (!data.images || data.images.length === 0) {
      throw new SoccerImagesError();
    }

    // pegando array de imagens atual da quadra (ou um array vazio se não existir)
    const currentImages = soccer.images || [];

    // juntando imagens atuais com as novas imagens
    const newImageList = [...currentImages, ...data.images];

    // quantidade maxima de imagens
    const MAX_TOTAL_IMAGES = 10;

    // validando quantidade
    if (newImageList.length > MAX_TOTAL_IMAGES) {
      throw new SoccerImagesLimitedError();
    }

    // atualizando quadra com novas imagens
    const updatedSoccerData: Soccer = {
      ...soccer,
      images: newImageList,
    };

    // mandando atualização para o banco de dados
    await this.updateSoccerOwnerRepository.updateSoccer(updatedSoccerData);

    // retornando dados esperados
    return { updatedImages: newImageList };
  }
}
