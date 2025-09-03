// exportando interface a ser implementada
export interface IDeleteSoccerByOwnerRepositories {
  deleteSoccerByOwner(userId: string): Promise<void>;
}
