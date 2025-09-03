// Importando entidade de RefreshToken para ser uma resposta da DTO
import { RefreshToken } from "../../../domain/entities/RefreshToken";

// exportando response do refreshToken promise(promessa)
export interface IRefreshTokenResponseDTO {
  token: string;
  refreshToken?: RefreshToken;
}
