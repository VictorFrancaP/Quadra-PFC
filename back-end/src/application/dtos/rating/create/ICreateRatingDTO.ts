// exportando interface de dados
export interface ICreateRatingDTO {
  rating: number;
  userId: string;
  comments?: string;
  soccerId?: string;
  ratedUserId?: string;
}
