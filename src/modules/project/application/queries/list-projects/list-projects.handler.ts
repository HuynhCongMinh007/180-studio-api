import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ListProjectsQuery } from './list-projects.query'
import { Project } from '@/modules/project/domain/entities/project.entity'
import { ProjectRepository } from '@/modules/project/domain/repositories/project.repository'
import { ProjectView } from './project.view'
import { toProjectView } from './project-view.mapper'

@QueryHandler(ListProjectsQuery)
export class ListProjectsHandler implements IQueryHandler<
  ListProjectsQuery,
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
