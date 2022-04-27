import { IEventHandler } from './event-handler.interface';
import { IEventPublisher } from './event-publisher.interface';

export const EVENT_CLIENT_INJECTION_TOKEN = 'EVENT_CLIENT_INJECTION_TOKEN';

export type IEventClient = IEventHandler & IEventPublisher;
