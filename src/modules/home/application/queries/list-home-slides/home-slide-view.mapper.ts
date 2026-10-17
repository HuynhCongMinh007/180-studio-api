import { HomeSlide } from '@/modules/home/domain/entities/home-slide.entity'
import { HomeSlideView } from './home-slide.view'

export function toHomeSlideView(slide: HomeSlide): HomeSlideView {
  return {
    id: slide.id,
    imageUrl: slide.imageUrl,
    position: slide.position,
  }
}
