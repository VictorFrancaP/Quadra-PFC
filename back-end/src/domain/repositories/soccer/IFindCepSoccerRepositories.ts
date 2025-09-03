// exportando interface da promise (promessa)
export interface IFindCepSoccerRequest {
  cep: string;
  userId: string;
}

// exportando interface a ser implementada
export interface IFindCepSoccerRepositories {
  findCepSoccer(cep: string): Promise<IFindCepSoccerRequest | null>;
}
