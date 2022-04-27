import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GooglePubSubModule } from '../../core/lib/event-client/pub-sub';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `${process.cwd()}/env/.env`,
    }),
    GooglePubSubModule,
  ],
  controllers: [],
})
export class AppModule {}
