import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProjectCreatedEvent } from './project-created.event'
import { Logger } from '@nestjs/common'

@EventsHandler(ProjectCreatedEvent)
export class ProjectCreatedHandler implements IEventHandler<ProjectCreatedEvent> {
  private readonly _logger = new Logger(ProjectCreatedHandler.name)
  
  handle(event: ProjectCreatedEvent) {
    this._logger.log(`Project created: ${event.projectId}(${event.name})`)
  }
}
