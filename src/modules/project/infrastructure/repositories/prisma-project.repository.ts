import { Injectable } from '@nestjs/common'
import { ProjectRepository } from '@/modules/project/domain/repositories/project.repository'
import { PrismaService } from '@/database/prisma.service'
import { Project } from '@/modules/project/domain/entities/project.entity'
import { getTx } from '@/shared/domain/transactions/transaction-context'
import { Prisma } from '@/generated/prisma/client'
import { ProjectNotFoundError } from '@/modules/project/domain/errors/project.errors'
import { ProjectImage } from '@/modules/project/domain/value-objects/project-image.vo'

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
  async findUnique(projectId: string): Promise<Project | null> {
    const row = await this.db.project.findUnique({
      where: { id: projectId },
      include:{projectImages:true}
    })
    if(!row){
      return null
    }
   
    const {projectImages,...rest}= row
    const images = projectImages.map((projectImage) =>
      ProjectImage.create(projectImage),
    )
    const inputCreateProjectEntity = { ...rest, projectImages: images }
    const project = Project.create(inputCreateProjectEntity)
    return project
  }
  async patchProject(project: Project): Promise<Project> {
    await this.db.projectImage.deleteMany({ where: { projectId: project.id } })
    await this.db.project.update({
      where: { id: project.id },
      data: {
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
    return project
  }
}
