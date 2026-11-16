import { Project } from '@/modules/project/domain/entities/project.entity'

export abstract class ProjectRepository {
  abstract createProject(project: Project): Promise<{ projectId: string }>
  abstract deleteProject(
    projectId: string,
  ): Promise<{ projectId: string; name: string }>
  abstract findUnique(id:string):Promise<Project|null>
  abstract patchProject(project: Project): Promise<Project>
}
