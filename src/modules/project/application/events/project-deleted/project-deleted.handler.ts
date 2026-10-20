import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProjectDeletedEvent } from './project-deleted.event'
import { Logger } from '@nestjs/common'

@EventsHandler(ProjectDeletedEvent)
export class ProjectDeletedHandler implements IEventHandler<ProjectDeletedEvent> {
  private readonly logger = new Logger(ProjectDeletedHandler.name)

  handle(event: ProjectDeletedEvent) {
    this.logger.log(`Deleted project ${event.projectId} (${event.name})`)
  }
}
