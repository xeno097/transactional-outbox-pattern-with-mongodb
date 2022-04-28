import { Global, Logger, Module } from '@nestjs/common';
import { LOGGER_INJECTION_TOKEN } from './logger.interface';

@Global()
@Module({
  providers: [
    {
      provide: LOGGER_INJECTION_TOKEN,
      useValue: new Logger(),
    },
  ],
  exports: [LOGGER_INJECTION_TOKEN],
})
export class LoggerModule {}
