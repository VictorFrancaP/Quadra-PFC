// exportando interface a ser implementada
export interface IDeleteManyRefreshTokenRepositories {
  deleteManyRefreshToken(userId: string): Promise<void>;
}
