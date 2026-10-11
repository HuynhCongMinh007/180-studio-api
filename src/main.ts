import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';
import { DomainErrorFilter } from './shared/presentation/filters/domain-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new DomainErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
