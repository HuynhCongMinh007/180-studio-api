import { Project } from '@/modules/project/domain/entities/project.entity'

export abstract class ProjectRepository {
  abstract findAllProjects(): Promise<Project[]>
  abstract addProject(project: Project): Promise<void>
}
