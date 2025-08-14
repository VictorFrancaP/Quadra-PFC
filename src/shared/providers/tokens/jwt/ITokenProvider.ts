// Importando tipos de permissões do sistema
import { userPermissions } from "../../../../domain/entities/User";

// exportando interface de payload para a geração do JWT
export interface ITokenRequest {
  id: string;
  role: userPermissions;
}

// exportando interface a ser implementada
export interface ITokenProvider {
  generateTokenUser(tokenPayload: ITokenRequest): Promise<string>;
}
