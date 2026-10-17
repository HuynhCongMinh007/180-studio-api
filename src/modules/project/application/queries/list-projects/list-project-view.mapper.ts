import { Project } from '@/modules/project/domain/entities/project.entity'
import { ProjectView } from './list-project.view'

export function toProjectView(project: Project): ProjectView {
  const res: ProjectView = {
    id: project.id,
    name: project.name,
    imageUrl: project.projectImages[0].imageUrl,
  }
  return res
}
