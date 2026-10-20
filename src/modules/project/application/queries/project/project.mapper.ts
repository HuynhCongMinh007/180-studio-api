import { ProjectDetail } from '@/modules/project/domain/types/project-summary'
import { DetailProjectView } from './project.vew'

export function toDetailProjectView(project: ProjectDetail): DetailProjectView {
  const projectView: DetailProjectView = {
    id: project.id,
    name: project.name,
    year: project.year,
    location: project.location,
    siteArea: project.siteArea,
    floorArea: project.floorArea,
    client: project.client,
    photographer: project.photographer,
    videoUrl: project.videoUrl,
    projectImages: project.projectImages,
  }
  return projectView
}
