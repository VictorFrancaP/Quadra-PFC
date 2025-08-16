// Importando tipos de generos
import { userGender } from "../../entities/User";

// exportando interface de dados visiveis
export interface IProfileRequest {
  id: string;
  name: string;
  email: string;
  age: number;
  address: string;
  cep: string;
  cpf: string;
  gender: userGender;
  profileImage: string;
}
// exportando interface a ser implementada
export interface IProfileUserRepositories {
  viewProfile(userId: string): Promise<IProfileRequest | null>;
}
