// Importando interface a ser implementada nesta classe e redisConfig
import { IRedisProvider, IRedisRequest } from "./IRedisProvider";
import { redisConfig } from "../redisConfig";

// exportando classe de implementação de interface
export class RedisProvider implements IRedisProvider {
  // salvando dados no cache (redis)
  async dataSet(redisPayload: IRedisRequest): Promise<void> {
    await redisConfig.setEx(
      redisPayload.key,
      redisPayload.expiration,
      JSON.stringify(redisPayload.values)
    );
  }

  // pegando dados salvos no cache (redis)
  async dataGet(key: string): Promise<string | null> {
    const datas = await redisConfig.get(key);

    return datas;
  }

  // deletando dados salvos no cache (redis)
  async dataDelete(key: string): Promise<number> {
    const datas = await redisConfig.del(key);

    return datas;
  }
}
