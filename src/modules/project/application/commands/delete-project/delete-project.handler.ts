import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { DeleteProjectCommand } from './delete-project.command'
import { TransactionManager } from '@/shared/domain/transactions/transaction-manager'
import { ProjectRepository } from '@/modules/project/domain/repositories/project.repository'
import { ProjectDeletedEvent } from '../../events/project-deleted/project-deleted.event'

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler implements ICommandHandler<DeleteProjectCommand> {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly transactionManager: TransactionManager,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: DeleteProjectCommand,
  ): Promise<{ projectId: string; name: string }> {
    const result = await this.transactionManager.run(async () => {
      return await this.projectRepository.deleteProject(command.projectId)
    })

    this.eventBus.publish(
      new ProjectDeletedEvent(result.projectId, result.name),
    )

    return result
  }
}
