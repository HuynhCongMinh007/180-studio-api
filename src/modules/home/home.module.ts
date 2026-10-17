import { Module } from '@nestjs/common'
import { ListHomeSlidesHandler } from './application/queries/list-home-slides/list-home-slides.handler'
import { HomeSlideRepository } from './domain/repositories/home-slide.repository'
import { PrismaHomeSlideRepository } from './infrastructure/repositories/prisma-home-slide.repository'
import { PublicHomeSlideController } from './presentation/controllers/public-home-slide.controller'

@Module({
  controllers: [PublicHomeSlideController],
  providers: [
    ListHomeSlidesHandler,
    // Bind the domain port to its Prisma adapter.
    { provide: HomeSlideRepository, useClass: PrismaHomeSlideRepository },
  ],
})
export class HomeModule {}
