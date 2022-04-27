import { v4 as uuid } from 'uuid';

export abstract class BaseEvent {
  readonly id: string;
  abstract type: string;
  abstract payload: unknown;
  readonly createdAt: string;
  abstract handled: boolean;

  constructor() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  abstract toJSON(): unknown;
}
