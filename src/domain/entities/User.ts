// criando e exportando tipos de permissões
export type userPermissions = "USER" | "ADMIN" | "OWNER";

// criando e exportando tipos de gêneros
export type userGender = "MALE" | "FEMALE" | "NOTINFORM";

// exportando classe de entidade
export class User {
  // criando atributos
  public id?: string;
  public name: string;
  public email: string;
  public password: string;
  public age: number;
  public role: userPermissions;
  public address: string;
  public cep: string;
  public cpf: string;
  public gender: userGender;

  // atributos opcionais
  public profileImage?: string;
  public resetToken?: string | null;
  public resetExpiredToken?: Date | null;
  public loginAttempts?: number | null;
  public lockAccount?: Date | null;

  // criando construtor (inicializador)
  constructor(
    name: string,
    email: string,
    password: string,
    age: number,
    role: userPermissions,
    address: string,
    cep: string,
    cpf: string,
    gender: userGender,
    id?: string,
    profileImage?: string,
    resetToken?: string | null,
    resetExpiredToken?: Date | null,
    loginAttempts?: number | null,
    lockAccount?: Date | null
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.age = age;
    this.role = role;
    this.address = address;
    this.cep = cep;
    this.cpf = cpf;
    this.gender = gender;

    if (id) this.id = id;
    if (profileImage !== undefined) this.profileImage = profileImage;
    if (resetToken !== undefined) this.resetToken = resetToken;
    if (resetExpiredToken !== undefined)
      this.resetExpiredToken = resetExpiredToken;
    if (loginAttempts !== undefined) this.loginAttempts = loginAttempts;
    if (lockAccount !== undefined) this.lockAccount = lockAccount;
  }
}
