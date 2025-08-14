// Importando entidade RefreshToken para promise(promessa)
import { RefreshToken } from "../../entities/RefreshToken";

// exportando interface a ser implementada
export interface ICreateRefreshTokenRepositories {
  createRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken>;
}
