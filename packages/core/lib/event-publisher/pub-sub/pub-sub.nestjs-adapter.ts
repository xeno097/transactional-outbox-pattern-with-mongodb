import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { PubSubClient } from './pub-sub.client';

export class GooglePubSubClientNestAdapter
  extends Server
  implements CustomTransportStrategy
{
  constructor(private readonly client: PubSubClient) {
    super();
  }

  public async listen(callback: () => void) {
    await this.registerHandlers();

    callback();
  }

  private async registerHandlers() {
    const patternHandler = [...this.messageHandlers.keys()];

    for (const key of patternHandler) {
      const messageHandler = this.messageHandlers.get(key);

      await this.client.subscribe(key, messageHandler as any);
    }
  }

  public async close() {
    await this.client.close();
  }
}
