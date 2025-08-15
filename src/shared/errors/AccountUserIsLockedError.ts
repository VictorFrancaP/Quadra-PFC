// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "./ErrorSuper";

// exportando classe de error personalizada
export class AccountUserIsLockedError extends ErrorSuper {
  constructor() {
    super(
      "Sua conta está bloqueada temporariamente. Tente novamente mais tarde!",
      401
    );
  }
}

// exportando classe de error personalizada
export class AccountUserIsLockedNowError extends ErrorSuper {
  constructor() {
    super("Sua conta foi bloqueada, por excessos de tentativas!", 400);
  }
}

// exportando classe de error personalizada
export class AccountUserIsBlockError extends ErrorSuper {
  constructor() {
    super(
      "Sua conta foi bloqueada permanentemente. Entre em contato com o suporte para solicitar o desbloqueio!",
      400
    );
  }
}
