import { Injectable } from '@nestjs/common'
import type { HomeSlide as HomeSlideRecord } from '@/generated/prisma/client'
import { PrismaService } from '@/database/prisma.service'
import { HomeSlide } from '@/modules/home/domain/entities/home-slide.entity'
import { HomeSlideRepository } from '@/modules/home/domain/repositories/home-slide.repository'
import { toHomeSlide } from '@/modules/home/infrastructure/mappers/home-slide.mapper'

@Injectable()
export class PrismaHomeSlideRepository extends HomeSlideRepository {
  private readonly prisma: PrismaService

  constructor(prisma: PrismaService) {
    super()
    this.prisma = prisma
  }

  async findAllOrdered(): Promise<HomeSlide[]> {
    const records: HomeSlideRecord[] = await this.prisma.homeSlide.findMany({
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    })

    const slides: HomeSlide[] = []
    for (const record of records) {
      const slide: HomeSlide = toHomeSlide(record)
      slides.push(slide)
    }

    return slides
  }
}
