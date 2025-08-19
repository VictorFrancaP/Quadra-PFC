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
  public profileImage: string;

  // atributos opcionais
  public resetToken?: string | null;
  public resetTokenExpired?: Date | null;
  public loginAttempts?: number | null;
  public lockAccount?: Date | null;
  public accountBlock?: boolean;

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
    profileImage: string,
    id?: string,
    resetToken?: string | null,
    resetTokenExpired?: Date | null,
    loginAttempts?: number | null,
    lockAccount?: Date | null,
    accountBlock?: boolean
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
    this.profileImage = profileImage;

    if (id) this.id = id;
    if (resetToken !== undefined) this.resetToken = resetToken;
    if (resetTokenExpired !== undefined)
      this.resetTokenExpired = resetTokenExpired;
    if (loginAttempts !== undefined) this.loginAttempts = loginAttempts;
    if (lockAccount !== undefined) this.lockAccount = lockAccount;
    if (accountBlock !== undefined) this.accountBlock = accountBlock;
  }

  // criando metodo estatico para atualização do usuário (static)
  static updateUserInfos(existing: User, updates: Partial<User>): User {
    return new User(
      updates.name ?? existing.name,
      existing.email,
      updates.password ?? existing.password,
      updates.age ?? existing.age,
      updates.role ?? existing.role,
      updates.address ?? existing.address,
      updates.cep ?? existing.cep,
      existing.cpf,
      existing.gender,
      existing.profileImage,
      existing.id,
      updates.resetToken !== undefined
        ? updates.resetToken
        : existing.resetToken,
      updates.resetTokenExpired !== undefined
        ? updates.resetTokenExpired
        : existing.resetTokenExpired,
      updates.loginAttempts ?? existing.loginAttempts,
      updates.lockAccount ?? existing.lockAccount,
      updates.accountBlock ?? existing.accountBlock
    );
  }
}
