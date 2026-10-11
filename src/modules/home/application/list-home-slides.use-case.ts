import { Injectable } from '@nestjs/common';
import { HomeSlide } from '../domain/entities/home-slide.entity';
import { HomeSlideRepository } from '../domain/repositories/home-slide.repository';

@Injectable()
export class ListHomeSlidesUseCase {
  constructor(private readonly homeSlides: HomeSlideRepository) { }

  execute(): Promise<HomeSlide[]> {
    return this.homeSlides.findAllOrdered();
  }
}
