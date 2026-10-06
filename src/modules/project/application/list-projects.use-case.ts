import { Injectable } from '@nestjs/common'
import { ProjectRepository } from '../domain/repositories/project.repository'
import { Project } from '../domain/entities/project.entity'

@Injectable()
export class ListProjectsUseCase {
  private readonly _projectRepository: ProjectRepository
  constructor(projectRepository: ProjectRepository) {
    this._projectRepository = projectRepository
  }
  async execute(): Promise<Project[]> {
    const projects = await this._projectRepository.findAllProjects()
    return projects
  }
}
