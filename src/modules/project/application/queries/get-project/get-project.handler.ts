import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetProjectQuery } from './get-project.query'
import { ProjectDetailView } from './project-detail.view'
import { toProjectDetailView } from './project-detail-view.mapper'
import { ProjectQueryRepository } from '@/modules/project/domain/repositories/project-query.repository'
import { ProjectNotFoundError } from '@/modules/project/domain/errors/project.errors'

@QueryHandler(GetProjectQuery)
export class GetProjectHandler implements IQueryHandler<GetProjectQuery> {
  constructor(
    private readonly projectQueryRepository: ProjectQueryRepository,
  ) {}

  async execute(query: GetProjectQuery): Promise<ProjectDetailView> {
    const project = await this.projectQueryRepository.findOne(query.projectId)
    if (!project) {
      throw new ProjectNotFoundError(query.projectId)
    }
    return toProjectDetailView(project)
  }
}
