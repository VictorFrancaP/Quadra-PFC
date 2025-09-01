// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de erro personalizada
export class LimitRatingSendMailError extends ErrorSuper {
  constructor() {
    super(
      "Aguarde alguns minutos para efetuar outro envio de e-mail de confirmação!",
      400
    );
  }
}

// exportando classe de error personalizada
export class LimitRatingUpdateProfileUserError extends ErrorSuper {
  constructor() {
    super(
      "Aguarde alguns segundos para atualizar o seu perfil novamente!",
      400
    );
  }
}
