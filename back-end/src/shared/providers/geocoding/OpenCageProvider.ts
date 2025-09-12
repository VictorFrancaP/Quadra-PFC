import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import { IOpenCageProvider } from "./IOpenCageProvider";

// Error personalizado
import { UnknownError } from "../../errors/UnknownError";

export class OpenCageProvider implements IOpenCageProvider {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.opencagedata.com/geocode/v1/json";

  constructor() {
    if (!process.env.OPENCAGE_KEY) {
      throw new Error("OPENCAGE_KEY não definida no .env");
    }
    this.apiKey = process.env.OPENCAGE_KEY;
  }

  async getCoordinates(
    cep: string
  ): Promise<{ latitude: number; longitude: number }> {
    try {
      // Faz a requisição usando params do axios (mais seguro que string interpolada)
      const { data } = await axios.get(this.baseUrl, {
        params: {
          q: cep,
          key: this.apiKey,
          countrycode: "br",
          language: "pt",
          limit: 1,
        },
      });

      // Validação da CEP inserido
      if (!data.results || data.results.length === 0) {
        return { latitude: 0, longitude: 0 };
      }

      // pegando latitude e longitude gerada
      const { lat, lng } = data.results[0].geometry;

      // retornando latitude e longitude
      return { latitude: lat, longitude: lng };
    } catch (err: any) {
      throw new UnknownError();
    }
  }
}
