import { CreateProjectRequest } from '../dtos/project.request.dto'
import { CreateProjectInput } from '../../application/create-projects.use-case'

export function toCreateProjectInput(
  dto: CreateProjectRequest,
): CreateProjectInput {
  return {
    name: dto.name,
    year: dto.year ?? null,
    location: dto.location ?? null,
    siteArea: dto.siteArea ?? null,
    floorArea: dto.floorArea ?? null,
    client: dto.client ?? null,
    photographer: dto.photographer ?? null,
    videoUrl: dto.videoUrl ?? null,
    projectImages: dto.projectImages.map((img) => ({
      imageUrl: img.imageUrl,
      coverPriority: img.coverPriority ?? null,
    })),
  }
}
