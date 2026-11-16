import { PatchProjectCommand } from '@/modules/project/application/commands/patch-project/patch-project.command'
import { ProjectNotFoundError } from '@/modules/project/application/errors/project-not-found'
import { ProjectChanges } from '@/modules/project/domain/entities/project.entity'
import { ProjectRepository } from '@/modules/project/domain/repositories/project.repository'
import { ProjectImage } from '@/modules/project/domain/value-objects/project-image.vo'
import { TransactionManager } from '@/shared/domain/transactions/transaction-manager'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

@CommandHandler(PatchProjectCommand)
export class PatchProjectHandler implements ICommandHandler<PatchProjectCommand> {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly managerTransaction: TransactionManager,
  ) {}
  async execute(command: PatchProjectCommand): Promise<null> {
    await this.managerTransaction.run(async () => {
      const oldProject = await this.projectRepository.findUnique(command.id)
      if (!oldProject) {
        throw new ProjectNotFoundError(command.id)
      }
      const { projectImages, ...rest } = command.props
      const changes: ProjectChanges = {
        ...rest,
        projectImages: projectImages?.map((image) =>
          ProjectImage.create(image),
        ),
      }
      const newProject = oldProject.patch(changes)
      await this.projectRepository.patchProject(newProject)
    })
    return null
  }
}
