// exportando entidade Message
export class Message {
  // atributos
  public id?: string;
  public content: string;
  public senderId: string;
  public chatId: string;

  // construtor
  constructor(
    content: string,
    senderId: string,
    chatId: string,
    id?: string
  ) {
    this.content = content;
    this.senderId = senderId;
    this.chatId = chatId;

    if (id) this.id = id;
  }
}
