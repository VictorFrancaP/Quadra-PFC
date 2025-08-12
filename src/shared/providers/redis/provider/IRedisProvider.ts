// Exportando interface de payload
export interface IRedisRequest {
  key: string;
  expiration: number;
  values: {
    value?: string;
    name?: string;
    email?: string;
    token?: string;
    refresh_token?: string;
  };
}

// Exportando interface a ser implementada
export interface IRedisProvider {
  dataSet(redisPayload: IRedisRequest): Promise<void>;
  dataGet(key: string): Promise<string | null>;
  dataDelete(key: string): Promise<number>;
}
