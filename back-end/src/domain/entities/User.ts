// criando objeto imutavel com tipos de permissões
export const userPermissions = {
  USER: "USER",
  ADMIN: "ADMIN",
  OWNER: "OWNER",
} as const;

// exportando apenas os tipos sem as keys(chaves)
export type userPermissions =
  (typeof userPermissions)[keyof typeof userPermissions];

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
  public latitude?: number | null;
  public longitude?: number | null;
  public resetToken?: string | null;
  public resetTokenExpired?: Date | null;
  public loginAttempts?: number | null;
  public lockAccount?: Date | null;
  public twoFactorSecret?: string | null;
  public isTwoFactorEnabled?: boolean;
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
    latitude?: number | null,
    longitude?: number | null,
    id?: string,
    resetToken?: string | null,
    resetTokenExpired?: Date | null,
    loginAttempts?: number | null,
    lockAccount?: Date | null,
    twoFactorSecret?: string | null,
    isTwoFactorEnabled?: boolean,
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

    if (latitude !== undefined) this.latitude = latitude;
    if (longitude !== undefined) this.longitude = longitude;
    if (id) this.id = id;
    if (resetToken !== undefined) this.resetToken = resetToken;
    if (resetTokenExpired !== undefined)
      this.resetTokenExpired = resetTokenExpired;
    if (loginAttempts !== undefined) this.loginAttempts = loginAttempts;
    if (lockAccount !== undefined) this.lockAccount = lockAccount;
    if (twoFactorSecret !== undefined) this.twoFactorSecret = twoFactorSecret;
    if (isTwoFactorEnabled !== undefined)
      this.isTwoFactorEnabled = isTwoFactorEnabled;
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
      existing.cpf !== "" ? existing.cpf : updates.cpf!,
      existing.gender,
      existing.profileImage,
      updates.latitude !== undefined ? updates.latitude : existing.latitude,
      updates.longitude !== undefined ? updates.longitude : existing.longitude,
      existing.id,
      updates.resetToken !== undefined
        ? updates.resetToken
        : existing.resetToken,
      updates.resetTokenExpired !== undefined
        ? updates.resetTokenExpired
        : existing.resetTokenExpired,
      updates.loginAttempts ?? existing.loginAttempts,
      updates.lockAccount !== undefined
        ? updates.lockAccount
        : existing.lockAccount,
      updates.twoFactorSecret !== undefined
        ? updates.twoFactorSecret
        : existing.twoFactorSecret,
      updates.isTwoFactorEnabled ?? existing.isTwoFactorEnabled,
      updates.accountBlock ?? existing.accountBlock
    );
  }
}
