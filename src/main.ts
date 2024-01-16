import { NestFactory } from '@nestjs/core';
import { NewModule } from './module';

async function bootstrap() {
  const app = await NestFactory.create(NewModule);
  await app.listen(3000);
}
bootstrap();
