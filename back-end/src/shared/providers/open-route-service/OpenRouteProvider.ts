// Importando axios para a utilização de api
import axios from "axios";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// Importando interface a ser implementada nesta classe
import { IOpenRouteProvider } from "./IOpenRouteProvider";

// exportando classe de implementação de interface
export class OpenRouteProvider implements IOpenRouteProvider {
  constructor(
    private readonly apiKey = process.env.OPENROUTE_KEY as string,
    private readonly baseUrl = process.env.OPENROUTE_BASEURL as string
  ) {
    if (!this.apiKey || !this.baseUrl) {
      throw new Error("API_KEY e BASE_URL precisam ser configurados!");
    }
  }
  async calculateDistance(
    origin: [number, number],
    destination: [number, number]
  ): Promise<number | null> {
    // criando try/catch para capturar erros na execução
    try {
      // fazendo uma requisição para a api e guardando em uma variavel
      const response = await axios.post(
        this.baseUrl,
        {
          coordinates: [
            [origin[1], origin[0]],
            [destination[1], destination[0]],
          ],
        },
        {
          headers: {
            Authorization: this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      // pegando distância em metros
      const distanceM = response.data.routes[0].summary.distance;

      // retornando distância em KM
      return distanceM / 1000;
    } catch (err: any) {
      return null;
    }
  }
}
