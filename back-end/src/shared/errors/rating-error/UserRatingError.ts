// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe error personalizado
export class UserRatingError extends ErrorSuper {
  constructor() {
    super("Usuário só efetuar avaliações em quadras!", 400);
  }
}

// exportando classe error personalizado
export class UserRatingSameError extends ErrorSuper {
  constructor() {
    super("Você não pode se autoavaliar", 400);
  }
}

// exportando classe error personalizado
export class UserNotFoundRatingError extends ErrorSuper {
  constructor() {
    super("Não possivel criar uma avaliação sem um usuário!", 400);
  }
}
