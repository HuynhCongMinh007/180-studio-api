import { Injectable } from '@nestjs/common'
import { ProjectRepository } from '@/modules/project/domain/repositories/project.repository'
import { PrismaService } from '@/database/prisma.service'
import { Project } from '@/modules/project/domain/entities/project.entity'
import { getTx } from '@/shared/domain/transactions/transaction-context'
import { Prisma } from '@/generated/prisma/client'
import { ProjectNotFoundError } from '@/modules/project/domain/errors/project.errors'

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

  async deleteProject(
    projectId: string,
  ): Promise<{ projectId: string; name: string }> {
    try {
      const res = await this.db.project.delete({ where: { id: projectId } })
      return { projectId: res.id, name: res.name }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new ProjectNotFoundError(projectId)
      }
      throw error
    }
  }
}
