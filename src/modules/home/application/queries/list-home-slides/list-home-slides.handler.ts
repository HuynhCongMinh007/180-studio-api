import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { HomeSlideRepository } from '@/modules/home/domain/repositories/home-slide.repository'
import { ListHomeSlidesQuery } from './list-home-slides.query'
import { HomeSlideView } from './home-slide.view'
import { toHomeSlideView } from './home-slide-view.mapper'

@QueryHandler(ListHomeSlidesQuery)
export class ListHomeSlidesHandler implements IQueryHandler<ListHomeSlidesQuery> {
  constructor(private readonly homeSlideRepository: HomeSlideRepository) {}

  async execute(): Promise<HomeSlideView[]> {
    const slides = await this.homeSlideRepository.findAllOrdered()
    return slides.map(toHomeSlideView)
  }
}
