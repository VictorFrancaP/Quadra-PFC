// tipos de gêneros
import { userGender } from "../../../../domain/entities/User";

// Exportando interface de dados
export interface ICreateUserDTO {
  token: string;
  password: string;
  age: number;
  address: string;
  cep: string;
  cpf: string;
  gender: userGender;
}
