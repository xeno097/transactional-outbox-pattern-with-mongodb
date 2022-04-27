import { BaseEvent, IEventMetadata } from '.';

type GreetingPayload = {
  id: string;
  text: string;
  createdAt: string;
};

export class CreatedGreetingEvent extends BaseEvent {
  readonly type: string = 'created.greeting';
  readonly payload: GreetingPayload;

  constructor(greeting: GreetingPayload, metadata: IEventMetadata) {
    super(metadata);
    this.payload = greeting;
  }

  toJSON(): unknown {
    return {
      id: this.id,
      type: this.type,
      payload: this.payload,
      metadata: this.metadata,
    };
  }
}
