import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PubSubClient } from '../../core/lib/event-client/pub-sub/pub-sub.client';
import { EVENT_CLIENT_INJECTION_TOKEN } from '../../core/lib';
import { ConfigKeyEnum } from './config/config-key.enum';
import { MongooseModule } from '@nestjs/mongoose';
import { GreetingModule } from './greeting/greeting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/env/.env`,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get(ConfigKeyEnum.MONGO_URI),
        };
      },
    }),
    GreetingModule,
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
