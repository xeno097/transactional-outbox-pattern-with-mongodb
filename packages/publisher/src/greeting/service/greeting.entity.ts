import { v4 as uuid } from 'uuid';

export class GreetingEntity {
  readonly id: string;
  readonly text: string;
  readonly createdAt: string;

  constructor(text: string) {
    this.id = uuid();
    this.text = text;
    this.createdAt = new Date().toISOString();
  }
}
