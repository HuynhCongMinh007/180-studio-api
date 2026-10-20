import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ListProjectsQuery } from './list-projects.query'
import { ProjectQueryRepository } from '@/modules/project/domain/repositories/project-query.repository'
import { ListProjectsView } from './project.view'
import { toProjectView } from './project-view.mapper'

@QueryHandler(ListProjectsQuery)
export class ListProjectsHandler implements IQueryHandler<ListProjectsQuery> {
  private readonly _projectQueryRepository: ProjectQueryRepository

  constructor(projectQueryRepository: ProjectQueryRepository) {
    this._projectQueryRepository = projectQueryRepository
  }
  async execute(query: ListProjectsQuery): Promise<ListProjectsView> {
    const { items, total } = await this._projectQueryRepository.findAll(
      query.page,
      query.limit,
    )
    return { items: items.map(toProjectView), total }
  }
}
