import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ListProjectsQuery } from './list-projects.query'
import { ProjectQueryRepository } from '@/modules/project/domain/repositories/project-query.repository'
import { ProjectSummary } from '@/modules/project/domain/types/project-summary'
import { ProjectView } from './project.view'
import { toProjectView } from './project-view.mapper'

@QueryHandler(ListProjectsQuery)
export class ListProjectsHandler implements IQueryHandler<ListProjectsQuery> {
  private readonly _projectQueryRepository: ProjectQueryRepository
  constructor(projectQueryRepository: ProjectQueryRepository) {
    this._projectQueryRepository = projectQueryRepository
  }
  async execute(): Promise<ProjectView[]> {
    const projects = await this._projectQueryRepository.findAll()
    return projects.map((project: ProjectSummary) => toProjectView(project))
  }
}
