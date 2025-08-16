// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "./ErrorSuper";

// exportando classe de error personalizada
export class RefreshTokenNotFoundError extends ErrorSuper {
  constructor() {
    super("Refresh token inválido ou expirado!", 400);
  }
}
