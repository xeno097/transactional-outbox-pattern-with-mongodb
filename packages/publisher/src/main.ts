import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ConfigKeyEnum } from 'src/config/config-key.enum';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  const PORT = configService.get(ConfigKeyEnum.PORT, 3000);

  await app.listen(PORT);
}

bootstrap();
