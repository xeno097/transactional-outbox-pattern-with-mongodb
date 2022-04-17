import { BaseEvent } from '../classes/base-event.abstract-class';

export interface IEventPublisher {
  publish<T extends BaseEvent>(event: T['name'], data: T['data']): void;
}
