// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "../ErrorSuper";

// exportando classe de error personalizada
export class OwnerRatingError extends ErrorSuper {
  constructor() {
    super("O proprietário não pode avaliar a sua quadra!", 400);
  }
}

// exportando classe de error personalizada
export class OwnerRatingOtherError extends ErrorSuper {
  constructor() {
    super(
      "Um proprietário não pode avaliar as quadras de outros proprietários!",
      400
    );
  }
}
