import { Injectable } from '@nestjs/common'
import { ProjectRepository } from '../domain/repositories/project.repository'
import { Project, ProjectProps } from '../domain/entities/project.entity'
import { ProjectImage } from '../domain/value-objects/project-image.vo'
import { randomUUID } from 'crypto'

export interface CreateProjectInput {
  name: string
  year: number | null | undefined
  location: string | null | undefined
  siteArea: number | null | undefined
  floorArea: number | null | undefined
  client: string | null | undefined
  photographer: string | null | undefined
  videoUrl: string | null | undefined
  projectImages: {
    imageUrl: string
    coverPriority: number | null
  }[]
}

function toProjectEntity(project: CreateProjectInput): Project {
  const projectImages: ProjectImage[] = project.projectImages.map((image) =>
    ProjectImage.create(image),
  )
  const pro: ProjectProps = {
    id: randomUUID(),
    name: project.name,
    year: project.year,
    location: project.location,
    siteArea: project.siteArea,
    floorArea: project.floorArea,
    client: project.client,
    photographer: project.photographer,
    videoUrl: project.videoUrl,
    projectImages: projectImages,
  }
  return Project.create(pro)
}

@Injectable()
export class CreateProjectUsecase {
  private readonly _projectRepository: ProjectRepository

  constructor(projectRepository: ProjectRepository) {
    this._projectRepository = projectRepository
  }

  async execute(project: CreateProjectInput): Promise<void> {
    const projectEntity = toProjectEntity(project)
    const res = await this._projectRepository.createProject(projectEntity)
    return res
  }
}
