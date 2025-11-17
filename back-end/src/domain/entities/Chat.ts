// exportando entidade Chat
export class Chat {
  // atributos
  public id?: string;
  public userOneId: string;
  public userTwoId: string;
  public participantIds: string[];

  // construtor
  constructor(
    userOneId: string,
    userTwoId: string,
    participantIds: string[],
    id?: string
  ) {
    this.userOneId = userOneId;
    this.userTwoId = userTwoId;
    this.participantIds = participantIds;

    if (id) this.id = id;
  }
}
