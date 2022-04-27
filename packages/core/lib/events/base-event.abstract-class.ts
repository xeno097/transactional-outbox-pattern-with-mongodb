import { v4 as uuid } from 'uuid';

export interface IEventMetadata {
  createdBy: string;
  handled?: boolean;
}

export class EventMetadata {
  readonly createdBy: string;
  readonly handled?: boolean;

  constructor(createdBy: string, handled: boolean = false) {
    this.createdBy = createdBy;
    this.handled = handled;
  }
}

export abstract class BaseEvent {
  readonly id: string;
  abstract type: string;
  abstract payload: unknown;
  readonly createdAt: string;
  readonly metadata: EventMetadata;

  constructor(metadata: IEventMetadata) {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.metadata = new EventMetadata(metadata.createdBy, metadata.handled);
  }
}
