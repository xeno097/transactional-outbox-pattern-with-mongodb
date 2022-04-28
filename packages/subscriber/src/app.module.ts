import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from '../../core/lib';
import { GooglePubSubModule } from '../../core/lib/event-client/pub-sub';
import { ConfigKeyEnum } from './config/config-key.enum';
import { GreetingModule } from './greeting/greeting.module';
import { InboxModule } from './inbox/inbox.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
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
    GooglePubSubModule,
    InboxModule,
    GreetingModule,
    LoggerModule,
  ],
  controllers: [],
})
export class AppModule {}
