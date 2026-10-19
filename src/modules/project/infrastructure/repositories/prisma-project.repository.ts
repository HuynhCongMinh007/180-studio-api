import { Injectable } from '@nestjs/common'
import { ProjectRepository } from '@/modules/project/domain/repositories/project.repository'
import { PrismaService } from '@/database/prisma.service'
import { Project } from '@/modules/project/domain/entities/project.entity'
import { ProjectWithImagesRecord } from '@/modules/project/infrastructure/records/project.record'
import { toProject } from '@/modules/project/infrastructure/mappers/project.mapper'
import { getTx } from '@/shared/domain/transaction/transaction-context'
import type { Prisma } from '@/generated/prisma/client'

@Injectable()
export class PrismaProjectRepository extends ProjectRepository {
  private readonly _prisma: PrismaService

  constructor(prisma: PrismaService) {
    super()
    this._prisma = prisma
  }

  private get db(): Prisma.TransactionClient {
    return getTx<Prisma.TransactionClient>() ?? this._prisma
  }

  async findAllProjects(): Promise<Project[]> {
    const records: ProjectWithImagesRecord[] = await this.db.project.findMany({
      include: {
        projectImages: {
          orderBy: { coverPriority: 'asc' },
          take: 1,
        },
      },
      orderBy: [{ createdAt: 'asc' }],
    })

    const projects: Project[] = []
    for (const record of records) {
      const project: Project = toProject(record)
      projects.push(project)
    }
    return projects
  }

  async createProject(project: Project): Promise<{ projectId: string }> {
    const res = await this.db.project.create({
      data: {
        id: project.id,
        name: project.name,
        year: project.year,
        location: project.location,
        siteArea: project.siteArea,
        floorArea: project.floorArea,
        client: project.client,
        photographer: project.photographer,
        videoUrl: project.videoUrl,
        projectImages: {
          create: project.projectImages.map((image) => ({
            imageUrl: image.imageUrl,
            coverPriority: image.coverPriority,
          })),
        },
      },
    })
    return { projectId: res.id }
  }

  async deleteProject(projectId: string): Promise<{ projectId: string }> {
    const res = await this.db.project.delete({
      where: {
        id: projectId,
      },
    })

    return { projectId: res.id }
  }
}
