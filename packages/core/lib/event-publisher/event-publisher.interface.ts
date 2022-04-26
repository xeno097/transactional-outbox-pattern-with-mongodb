import { BaseEvent } from '../classes/base-event.abstract-class';

export interface IEventPublisher {
  publish<T extends BaseEvent>(event: T['type'], data: T): void;
}
