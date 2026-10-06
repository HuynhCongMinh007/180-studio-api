import { HomeSlide } from '../entities/home-slide.entity'

export abstract class HomeSlideRepository {
  abstract findAllOrdered(): Promise<HomeSlide[]>
}
