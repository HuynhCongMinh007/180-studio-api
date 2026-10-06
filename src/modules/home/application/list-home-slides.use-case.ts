import { Injectable } from '@nestjs/common'
import { HomeSlide } from '@/modules/home/domain/entities/home-slide.entity'
import { HomeSlideRepository } from '@/modules/home/domain/repositories/home-slide.repository'

@Injectable()
export class ListHomeSlidesUseCase {
  private readonly _homeSlideRepository: HomeSlideRepository

  constructor(homeSlideRepository: HomeSlideRepository) {
    this._homeSlideRepository = homeSlideRepository
  }

  async execute(): Promise<HomeSlide[]> {
    const homeSlides: HomeSlide[] =
      await this._homeSlideRepository.findAllOrdered()
    return homeSlides
  }
}
