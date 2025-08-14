// Importando entidade RefreshToken para utilização de response da Login
import { RefreshToken } from "../../../domain/entities/RefreshToken";

// exportando interface de resposta da promise(promessa)
export interface IAuthUserResponseDTO {
  name: string;
  token: string;
  refreshToken: RefreshToken;
}
