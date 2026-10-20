import { Query } from '@nestjs/cqrs'
import { ProjectDetailView } from './project-detail.view'

export class GetProjectQuery extends Query<ProjectDetailView> {
  constructor(public readonly projectId: string) {
    super()
  }
}
