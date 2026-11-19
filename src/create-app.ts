import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './shared/presentation/filters/global-exception.filter'

export const API_PREFIX = 'api'

// Shared by main.ts (local HTTP server) and lambda.ts (AWS Lambda handler)
export async function createApp() {
  const app = await NestFactory.create(AppModule, {
    routeConflictPolicy: { duplicate: 'error', shadow: 'error' },
  })
  app.setGlobalPrefix(API_PREFIX)
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  return app
}
