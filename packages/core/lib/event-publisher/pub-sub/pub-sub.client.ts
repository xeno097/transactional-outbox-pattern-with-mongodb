import {
  PubSub,
  ClientConfig,
  Topic,
  Subscription,
} from '@google-cloud/pubsub';
import { BaseEvent } from '../../classes/base-event.abstract-class';
import { IEventPublisher } from '../event-publisher.interface';

export class PubSubClient implements IEventPublisher {
  private readonly _pubsub: PubSub;

  async publish<T extends BaseEvent>(event: T['type'], data: T): Promise<void> {
    const topic = await this._getTopic(event);

    await topic.publishMessage({
      json: data,
    });
  }

  constructor(pubSubConfig: ClientConfig) {
    this._pubsub = new PubSub(pubSubConfig);
  }

  private async _getTopic(topicName: string): Promise<Topic> {
    const topic = this._pubsub.topic(topicName);

    const [existTopic] = await topic.exists();

    if (!existTopic) {
      await topic.create();
    }

    return topic;
  }

  async subscribe(
    event: string,
    handler: (...args: any[]) => void,
  ): Promise<void> {
    const subscription = await this._getSubscription(event);

    subscription.on('message', (message) => {
      const data = message.data;

      handler(data);

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
