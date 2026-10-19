import { ProjectResponse } from '@/modules/project/presentation/dtos/project.response.dto'
import { ProjectView } from '../../application/queries/list-projects/project.view'

export function toProjectResponse(project: ProjectView): ProjectResponse {
  const projectResponse: ProjectResponse = {
    id: project.id,
    name: project.name,
    imageUrl: project.imageUrl,
  }
  return projectResponse
}
