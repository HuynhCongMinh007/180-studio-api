import { Controller, Get } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ListHomeSlidesQuery } from '../../application/queries/list-home-slides/list-home-slides.query'
import { ResponseDto } from '../../../../shared/presentation/dtos/response.dto'
import { HomeSlideResponse } from '../dtos/home-slide.response.dto'
import { toHomeSlideResponse } from '../mappers/home-slide-response.mapper'

@Controller('home-slides')
export class PublicHomeSlideController {
  private readonly queryBus: QueryBus

  constructor(queryBus: QueryBus) {
    this.queryBus = queryBus
  }

  @Get()
  async list(): Promise<ResponseDto<HomeSlideResponse[]>> {
    const views = await this.queryBus.execute(new ListHomeSlidesQuery())
    const slides = views.map((view) => toHomeSlideResponse(view))
    const message = 'Get home-slides successfully'
    return new ResponseDto<HomeSlideResponse[]>({ message, data: slides })
  }
}
