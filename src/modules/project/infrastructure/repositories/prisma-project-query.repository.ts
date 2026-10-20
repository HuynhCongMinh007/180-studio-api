import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'
import { ProjectQueryRepository } from '@/modules/project/domain/repositories/project-query.repository'
import {
  ProjectDetail,
  ProjectSummary,
} from '@/modules/project/domain/types/project-summary'

@Injectable()
export class PrismaProjectQueryRepository extends ProjectQueryRepository {
  private readonly _prisma: PrismaService

  constructor(prisma: PrismaService) {
    super()
    this._prisma = prisma
  }

  async findAll(): Promise<ProjectSummary[]> {
    return await this._prisma.project.findMany({
      select: {
        id: true,
        name: true,
        projectImages: {
          select: { imageUrl: true, coverPriority: true },
          orderBy: { coverPriority: 'asc' },
          take: 1,
        },
      },
      orderBy: [{ createdAt: 'asc' }],
    })
  }

  async findOne(id: string): Promise<ProjectDetail | null> {
    return await this._prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        year: true,
        location: true,
        siteArea: true,
        floorArea: true,
        client: true,
        photographer: true,
        videoUrl: true,
        projectImages: {
          select: { imageUrl: true, coverPriority: true },
          orderBy: { coverPriority: 'asc' },
        },
      },
    })
  }
}
