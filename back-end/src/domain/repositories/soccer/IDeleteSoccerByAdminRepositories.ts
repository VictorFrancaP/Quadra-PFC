// exportando interface a ser implementada
export interface IDeleteSoccerByAdminRepositories {
  deleteSoccerByAdmin(id: string): Promise<void>;
}
