import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { BaseEvent } from '../../events/base-event.abstract-class';
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

      const keyParsed: Pick<BaseEvent, 'type'> = JSON.parse(key);

      await this.client.registerHandler(keyParsed.type, messageHandler as any);
    }
  }

  public async close() {
    await this.client.close();
  }
}
