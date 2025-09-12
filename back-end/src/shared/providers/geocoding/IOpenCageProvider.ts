// exportando interface a ser implementada
export interface IOpenCageProvider {
  getCoordinates(cep: string): Promise<{ latitude: number; longitude: number }>;
}
