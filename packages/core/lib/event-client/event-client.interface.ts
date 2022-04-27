import { IEventHandler } from './event-handler.interface';
import { IEventPublisher } from './event-publisher.interface';

export const EVENT_HANDLER_INJECTION_TOKEN = 'EVENT_HANDLER_INJECTION_TOKEN';

export type IEventClient = IEventHandler & IEventPublisher;
