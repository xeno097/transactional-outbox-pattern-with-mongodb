import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from '../../core/lib';
import { GooglePubSubModule } from '../../core/lib/event-client/pub-sub';
import { ConfigKeyEnum } from './config/config-key.enum';
import { GreetingModule } from './greeting/greeting.module';
import { OutboxModule } from './outbox/outbox.module';

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
    OutboxModule,
    GreetingModule,
    GooglePubSubModule,
    LoggerModule,
  ],
  controllers: [],
})
export class AppModule {}
