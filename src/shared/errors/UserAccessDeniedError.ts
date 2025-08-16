// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "./ErrorSuper";

// exportando classe de error personalizada
export class UserAccessDeniedError extends ErrorSuper {
  constructor() {
    super(
      "Você não tem permissão para visualizar o perfil de outro usuário!",
      401
    );
  }
}
