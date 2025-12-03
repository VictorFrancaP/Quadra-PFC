// exportando interface a ser implementada
export interface IFindReservationUserActiveRepositories {
  findReservationActive(userId: string): Promise<boolean>;
}
