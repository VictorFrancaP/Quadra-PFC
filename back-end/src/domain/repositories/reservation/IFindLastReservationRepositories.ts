// exportando interface a ser implementada
export interface IFindLastReservationRepositories {
  findLastReservationEndTime(userId: string): Promise<Date | null>;
}
