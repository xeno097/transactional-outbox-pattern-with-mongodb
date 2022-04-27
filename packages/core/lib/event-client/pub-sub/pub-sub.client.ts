import {
  PubSub,
  ClientConfig,
  Topic,
  Subscription,
  Message,
} from '@google-cloud/pubsub';
import { BaseEvent } from '../../events/base-event.abstract-class';
import { IEventClient } from '../event-client.interface';

export class PubSubClient implements IEventClient {
  private readonly _pubsub: PubSub;

  constructor(pubSubConfig: ClientConfig) {
    this._pubsub = new PubSub(pubSubConfig);
  }

  async publish<T extends BaseEvent>(event: T['type'], data: T): Promise<void> {
    const topic = await this._getTopic(event);

    await topic.publishMessage({
      json: data,
    });
  }

  public async registerHandler(
    event: string,
    handler: (...args: any[]) => void | Promise<void>,
  ): Promise<void> {
    await this._subscribe(event, handler);
  }

  private async _getTopic(topicName: string): Promise<Topic> {
    const topic = this._pubsub.topic(topicName);

    const [existTopic] = await topic.exists();

    if (!existTopic) {
      await topic.create();
    }

    return topic;
  }

  private async _subscribe(
    event: string,
    handler: (...args: any[]) => void | Promise<void>,
  ): Promise<void> {
    const subscription = await this._getSubscription(event);

    subscription.on('message', async (message: Message) => {
      const data = JSON.parse(message.data.toString());

      await handler(data);

      message.ack();
    });
  }

  private async _getSubscription(
    subscriptionName: string,
  ): Promise<Subscription> {
    const topic = await this._getTopic(subscriptionName);

    const subscription = topic.subscription(`${subscriptionName}-subscription`);

    const [existSubscription] = await subscription.exists();

    if (!existSubscription) {
      await subscription.create();
    }

    return subscription;
  }

  public async close(): Promise<void> {
    return this._pubsub.closeAllClients_();
  }
}
