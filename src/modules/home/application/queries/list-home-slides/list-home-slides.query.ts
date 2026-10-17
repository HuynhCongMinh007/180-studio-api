import { Query } from '@nestjs/cqrs'
import { HomeSlideView } from './home-slide.view'

export class ListHomeSlidesQuery extends Query<HomeSlideView[]> {}
