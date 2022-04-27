export const EVENT_HANDLER_INJECTION_TOKEN = 'EVENT_HANDLER_INJECTION_TOKEN';

export interface IEventHandler {
  registerHandler(
    event: string,
    handler: (...args: any[]) => Promise<void> | void,
  ): Promise<void> | void;
}
