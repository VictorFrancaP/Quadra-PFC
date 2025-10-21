// Importando entidade de RefreshToken para ser uma resposta da DTO
import { User } from "../../../domain/entities/User";
import { RefreshToken } from "../../../domain/entities/RefreshToken";

// exportando response do refreshToken promise(promessa)
export interface IRefreshTokenResponseDTO {
  token: string;
  user: User;
  refreshToken?: RefreshToken;
}
