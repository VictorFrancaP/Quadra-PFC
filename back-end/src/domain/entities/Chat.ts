// exportando entidade Chat
export class Chat {
  // atributos
  public id?: string;
  public participantIds: string[];

  // construtor
  constructor(
    participantIds: string[],
    id?: string
  ) {
    this.participantIds = participantIds;

    if (id) this.id = id;
  }
}
