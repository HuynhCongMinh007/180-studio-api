import { Module } from '@nestjs/common';
import { ListHomeSlidesUseCase } from './application/list-home-slides.use-case';
import { HomeSlideRepository } from './domain/repositories/home-slide.repository';
import { PrismaHomeSlideRepository } from './infrastructure/repositories/prisma-home-slide.repository';
import { PublicHomeSlidesController } from './presentation/public-home-slides.controller';

@Module({
  controllers: [PublicHomeSlidesController],
  providers: [
    ListHomeSlidesUseCase,
    // Bind the domain port to its Prisma adapter.
    { provide: HomeSlideRepository, useClass: PrismaHomeSlideRepository },
  ],
})
export class HomeModule { }
