import { Query } from '@nestjs/cqrs'
import { ProjectView } from './project.view'

export class ListProjectsQuery extends Query<ProjectView[]> {}
