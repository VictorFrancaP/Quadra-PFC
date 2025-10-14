// Tipo dos dados em dayjs
import dayjs, { ManipulateType } from "dayjs";

// exportando interface a ser implementada
export interface IDayJsProvider {
  verify(data: Date): Promise<boolean>;
  add(time: number, type: ManipulateType): Promise<Date>;
  now() : Promise<dayjs.Dayjs>;
}
