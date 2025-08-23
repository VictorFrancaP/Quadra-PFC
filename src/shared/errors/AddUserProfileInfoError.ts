// Importando ErrorSuper para ser herdado
import { ErrorSuper } from "./ErrorSuper";

// exportando classe de error personalizado
export class AddUserProfileInfoError extends ErrorSuper {
  public readonly datas: string;
  constructor(datas: string) {
    super(
      `Insira os dados necessários para melhor experiência da plataforma: ${datas}`,
      400
    );
    this.datas = datas;
  }
}
