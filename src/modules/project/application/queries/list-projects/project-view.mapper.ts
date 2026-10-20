import { ProjectSummary } from '@/modules/project/domain/types/project-summary'
import { ProjectView } from './project.view'

export function toProjectView(project: ProjectSummary): ProjectView {
  const res: ProjectView = {
    id: project.id,
    name: project.name,
    imageUrl: project.projectImages[0]?.imageUrl ?? null,
  }
  return res
}
