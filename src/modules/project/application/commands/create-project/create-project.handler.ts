import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { CreateProjectCommand } from './create-project.command'
import { ProjectRepository } from '@/modules/project/domain/repositories/project.repository'
import { Project } from '@/modules/project/domain/entities/project.entity'
import { randomUUID } from 'crypto'
import {
  ProjectImage,
  ProjectImageProps,
} from '@/modules/project/domain/value-objects/project-image.vo'
import { ProjectCreatedEvent } from '../../events/create-project/project-created.event'
import { TransactionManager } from '@/shared/domain/transaction/transaction-manager'

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly eventBus: EventBus,
    private readonly transactionManager: TransactionManager,
  ) {}

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

    const result = await this.transactionManager.run(() =>
      this.projectRepository.createProject(project),
    )
    this.eventBus.publish(new ProjectCreatedEvent(project.name, project.id))
    return result
  }
}
