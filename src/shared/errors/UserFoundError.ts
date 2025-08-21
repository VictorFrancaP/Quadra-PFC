// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "./ErrorSuper";

// exportando classe de error personalizada
export class UserFoundError extends ErrorSuper {
  public readonly typeMessage: string;
  constructor(typeMessage: string) {
    super(`Este ${typeMessage} já está em uso!`, 400);
    this.typeMessage = typeMessage;
  }
}

// exportando classe de error personalizada
export class UsersNotFoundError extends ErrorSuper {
  constructor() {
    super("Não foi possivel encontrar nenhum usuário!", 400);
  }
}
