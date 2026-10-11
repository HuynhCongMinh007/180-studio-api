import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { HomeSlide } from '../../domain/entities/home-slide.entity';
import { HomeSlideRepository } from '../../domain/repositories/home-slide.repository';
import { toHomeSlide } from '../mappers/home-slide.mapper';

@Injectable()
export class PrismaHomeSlideRepository extends HomeSlideRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAllOrdered(): Promise<HomeSlide[]> {
    const records = await this.prisma.homeSlide.findMany({
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    });
    return records.map(toHomeSlide);
  }
}
