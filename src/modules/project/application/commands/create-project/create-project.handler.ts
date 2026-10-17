import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateProjectCommand } from './create-project.command'
import { ProjectRepository } from '@/modules/project/domain/repositories/project.repository'
import { Project } from '@/modules/project/domain/entities/project.entity'
import { randomUUID } from 'crypto'
import {
  ProjectImage,
  ProjectImageProps,
} from '@/modules/project/domain/value-objects/project-image.vo'

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  private readonly _projectRepository: ProjectRepository

  constructor(projectRepository: ProjectRepository) {
    this._projectRepository = projectRepository
  }
  async execute(command: CreateProjectCommand): Promise<{ projectId: string }> {
    const projectImages = command.projectImages.map(
      (image: ProjectImageProps) => ProjectImage.create(image),
    )
    const project: Project = Project.create({
      id: randomUUID(),
      name: command.name,
      year: command.year,
      location: command.location,
      siteArea: command.siteArea,
      floorArea: command.floorArea,
      client: command.client,
      photographer: command.photographer,
      videoUrl: command.videoUrl,
      projectImages: projectImages,
    })
    const projectId = await this._projectRepository.createProject(project)
    return projectId
  }
}
