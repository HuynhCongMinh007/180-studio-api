import { Query } from '@nestjs/cqrs'
import { DetailProjectView } from './project.vew'

export class DetailProjectQuery extends Query<DetailProjectView> {
  constructor(public readonly projectId: string) {
    super()
  }
}
