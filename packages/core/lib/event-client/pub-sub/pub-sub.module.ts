import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoreConfigKeyEnum } from 'lib/config/core-env-key.enum';
import { PubSubClient } from '.';
import { EVENT_CLIENT_INJECTION_TOKEN } from '..';

@Global()
@Module({
  providers: [
    {
      provide: EVENT_CLIENT_INJECTION_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const projectId = configService.get(
          CoreConfigKeyEnum.GOOGLE_PUBSUB_PROJECT_ID,
        );
        const apiEndpoint = configService.get(
          CoreConfigKeyEnum.GOOGLE_PUB_SUB_API_ENDPOINT,
        );

        return new PubSubClient({
          projectId,
          apiEndpoint,
        });
      },
    },
  ],
  exports: [EVENT_CLIENT_INJECTION_TOKEN],
})
export class GooglePubSubModule {}
