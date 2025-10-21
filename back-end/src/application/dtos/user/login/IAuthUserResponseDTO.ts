// Importando entidade User para ser uma promise(promessa)
import { User } from "../../../../domain/entities/User";

// exportando interface de resposta da promise(promessa)
export interface IAuthUserResponseDTO {
  step: "setup_2fa" | "2fa_required";
  user: User;
  token?: string;
  refreshToken?: string;
}
