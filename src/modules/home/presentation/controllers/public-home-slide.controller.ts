import { Controller, Get } from '@nestjs/common'
import { ListHomeSlidesUseCase } from '../../application/list-home-slides.use-case'
import { ResponseDto } from '../../../../shared/presentation/dtos/response.dto'
import { HomeSlideResponse } from '../dtos/home-slide.response.dto'
import { toHomeSlideResponse } from '../mappers/home-slide-response.mapper'

@Controller('home-slides')
export class PublicHomeSlideController {
  private readonly listHomeSlides: ListHomeSlidesUseCase
  
  constructor(listHomeSlides: ListHomeSlidesUseCase) {
    this.listHomeSlides = listHomeSlides
  }

  @Get()
  async list(): Promise<ResponseDto<HomeSlideResponse[]>> {
    const slides = await this.listHomeSlides.execute()
    const imageSlides = slides.map((slide) => toHomeSlideResponse(slide))
    const message = 'Get home-slides successfully'
    return new ResponseDto<HomeSlideResponse[]>({ message, data: imageSlides })
  }
}
