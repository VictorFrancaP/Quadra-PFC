// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizada
export class TokenUserError extends ErrorSuper {
  constructor() {
    super(
      "Não foi possivel atualizar a sua senha. Tente novamente mais tarde!",
      400
    );
  }
}

// exportando classe de error personalizada
export class ExpiredTimeUserError extends ErrorSuper {
  constructor() {
    super(
      "Tempo para atualização expirado. Solicite atualizar a sua novamente ou tente novamente mais tarde!",
      400
    );
  }
}
