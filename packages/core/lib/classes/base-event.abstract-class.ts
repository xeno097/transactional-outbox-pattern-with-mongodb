import { randomUUID } from 'crypto';

export abstract class BaseEvent {
  readonly id: string;
  abstract type: string;
  abstract payload: unknown;

  constructor() {
    this.id = randomUUID();
  }
}
