// Importando interface a ser implementada nesta classe e dayjs
import { IDayJsProvider } from "./IDayJsProvider";
import dayjs from "dayjs";

// exportando classe de implementação de interface
export class DayJsProvider implements IDayJsProvider {
  async verify(data: Date): Promise<boolean> {
    // verificando se a data está dentro do prazo ainda
    const resultVerify = dayjs().isAfter(data);

    // retornando resultado
    return resultVerify;
  }

  async add(time: number, type: dayjs.ManipulateType): Promise<Date> {
    // adicionando tempo
    const timeAdd = dayjs().add(time, type).toDate();

    // retornando adição
    return timeAdd;
  }
}
