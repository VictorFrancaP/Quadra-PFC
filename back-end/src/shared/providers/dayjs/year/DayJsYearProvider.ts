// Importando dayjs para manipulação de datas
import dayjs from "dayjs";

// exportando arrow function para pegar o ano atual
export const yearNow = () => {
  // pegando ano atual com dayjs
  const year = dayjs().year();

  // retornando ano
  return year;
};
