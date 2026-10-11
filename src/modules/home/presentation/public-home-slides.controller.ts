import { Controller, Get } from '@nestjs/common';
import { ListHomeSlidesUseCase } from '../application/list-home-slides.use-case';
import { HomeSlideResponse, toHomeSlideResponse } from './home-slide.response';

@Controller('site/home-slides')
export class PublicHomeSlidesController {
  constructor(private readonly listHomeSlides: ListHomeSlidesUseCase) {}

  // Spec §8.1: no slides returns an empty array, never 404.
  @Get()
  async list(): Promise<HomeSlideResponse[]> {
    const slides = await this.listHomeSlides.execute();
    return slides.map(toHomeSlideResponse);
  }
}
