import { ProjectDetail } from '@/modules/project/domain/read-models/project-detail'
import { ProjectDetailView } from './project-detail.view'

export function toProjectDetailView(project: ProjectDetail): ProjectDetailView {
  return {
    id: project.id,
    name: project.name,
    year: project.year,
    location: project.location,
    siteArea: project.siteArea,
    floorArea: project.floorArea,
    client: project.client,
    photographer: project.photographer,
    videoUrl: project.videoUrl,
    projectImages: project.projectImages.map((image) => ({
      imageUrl: image.imageUrl,
      coverPriority: image.coverPriority,
    })),
  }
}
