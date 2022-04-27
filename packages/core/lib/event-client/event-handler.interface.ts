export interface IEventHandler {
  registerHandler(
    event: string,
    handler: (...args: any[]) => Promise<void> | void,
  ): Promise<void> | void;
}
