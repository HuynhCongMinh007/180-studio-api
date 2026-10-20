import { Query } from '@nestjs/cqrs'
import { ListProjectsView } from './project.view'

export class ListProjectsQuery extends Query<ListProjectsView> {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {
    super()
  }
}
