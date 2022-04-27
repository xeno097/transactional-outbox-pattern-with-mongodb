import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EVENT_CLIENT_INJECTION_TOKEN } from '../../core/lib/';
import { PubSubClient } from '../../core/lib/event-client/pub-sub/pub-sub.client';
import { ConfigKeyEnum } from './config/config-key.enum';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `${process.cwd()}/env/.env`,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: EVENT_CLIENT_INJECTION_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const projectId = configService.get(
          ConfigKeyEnum.GOOGLE_PUBSUB_PROJECT_ID,
        );
        const apiEndpoint = configService.get(
          ConfigKeyEnum.GOOGLE_PUB_SUB_API_ENDPOINT,
        );

        return new PubSubClient({
          projectId,
          apiEndpoint,
        });
      },
    },
  ],
})
export class AppModule {}
