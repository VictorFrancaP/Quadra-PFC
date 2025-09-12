// exportando interface a ser implementada
export interface IOpenRouteProvider {
  calculateDistance(
    origin: [number, number],
    destination: [number, number]
  ): Promise<number | null>;
}
