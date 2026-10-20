import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'
import { ProjectQueryRepository } from '@/modules/project/domain/repositories/project-query.repository'
import { ProjectSummary } from '@/modules/project/domain/read-models/project-summary'
import { ProjectDetail } from '@/modules/project/domain/read-models/project-detail'

@Injectable()
export class PrismaProjectQueryRepository extends ProjectQueryRepository {
  private readonly _prisma: PrismaService

  constructor(prisma: PrismaService) {
    super()
    this._prisma = prisma
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ items: ProjectSummary[]; total: number }> {
    const getAll = async () =>
      await this._prisma.project.findMany({
        select: {
          id: true,
          name: true,
          projectImages: {
            select: { imageUrl: true, coverPriority: true },
            orderBy: { coverPriority: 'asc' },
            take: 1,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      })
    const counts = async () => await this._prisma.project.count()
    const [items, total] = await Promise.all([getAll(), counts()])

    return {
      items,
      total,
    }
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
