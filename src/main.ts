import 'dotenv/config'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './shared/presentation/filters/global-exception.filter'

const API_PREFIX = 'api/v1'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(API_PREFIX)
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  const port = process.env.PORT ?? 5000
  await app.listen(port)
  Logger.log(
    `Server started at http://localhost:${port}/${API_PREFIX}`,
    'Bootstrap',
  )
}
void bootstrap()
