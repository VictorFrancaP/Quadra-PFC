// exportando interface de dados
export interface IFindCnpjRequest {
  userId: string;
  cnpj: string;
}

// exportando interface a ser implementada
export interface IFindUserCnpjSolicitationOwnerRepositories {
  findUserCnpj(cnpj: string): Promise<IFindCnpjRequest | null>;
}
