import { Project } from '@/modules/project/domain/entities/project.entity'
import { ProjectResponse } from '@/modules/project/presentation/dtos/project.response.dto'

export function toProjectResponse(project: Project): ProjectResponse {
  const firstImage = project.projectImages[0]

  const projectResponse: ProjectResponse = {
    id: project.id,
    name: project.name,
    imageUrl: firstImage ? firstImage.imageUrl : null,
  }
  return projectResponse
}
