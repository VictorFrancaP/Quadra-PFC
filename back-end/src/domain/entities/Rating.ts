// exportando classe
export class Rating {
  // atributos
  public id?: string;
  public rating: number;
  public comments?: string;
  public userId: string;
  public soccerId?: string;
  public ratedUserId?: string;

  // inicializador
  constructor(
    rating: number,
    userId: string,
    comments?: string,
    soccerId?: string,
    ratedUserId?: string,
    id?: string
  ) {
    this.rating = rating;
    this.userId = userId;
    if (comments !== undefined) this.comments = comments;
    if (soccerId) this.soccerId = soccerId;
    if (ratedUserId) this.ratedUserId = ratedUserId;
    if (id) this.id = id;
  }
}
