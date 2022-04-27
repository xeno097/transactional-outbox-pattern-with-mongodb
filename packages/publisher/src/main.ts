import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ConfigKeyEnum } from 'src/config/config-key.enum';
import { AppModule } from './app.module';

import { EVENT_CLIENT_INJECTION_TOKEN, pubsub } from '../../core/lib';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  const pubSub = app.get<pubsub.PubSubClient>(EVENT_CLIENT_INJECTION_TOKEN);

  app.connectMicroservice({
    strategy: new pubsub.GooglePubSubClientNestAdapter(pubSub),
  });

  const PORT = configService.get(ConfigKeyEnum.PORT, 3000);

  await app.startAllMicroservices();

  await app.listen(PORT);
}

bootstrap();
