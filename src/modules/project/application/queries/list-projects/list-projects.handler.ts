import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ListProjectQuery } from './list-projects.query'
import { Project } from '@/modules/project/domain/entities/project.entity'
import { ProjectRepository } from '@/modules/project/domain/repositories/project.repository'
import { ProjectView } from './list-project.view'
import { toProjectView } from './list-project-view.mapper'

@QueryHandler(ListProjectQuery)
export class ListProjectHandler implements IQueryHandler<
  ListProjectQuery,
  Project[]
> {
  private readonly _projectRepository: ProjectRepository
  constructor(projectRepository: ProjectRepository) {
    this._projectRepository = projectRepository
  }
  async execute(): Promise<ProjectView[]> {
    const projects = await this._projectRepository.findAllProjects()
    const res = projects.map((pro: Project) => toProjectView(pro))
    return res
  }
}
