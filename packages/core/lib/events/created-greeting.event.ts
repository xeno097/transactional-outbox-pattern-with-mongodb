import { BaseEvent, IEventMetadata } from '.';

type GreetingPayload = {
  id: string;
  text: string;
  createdAt: string;
};

export const CREATED_GREETING_EVENT = 'created.greeting';

export class CreatedGreetingEvent extends BaseEvent {
  readonly type: string = CREATED_GREETING_EVENT;
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
