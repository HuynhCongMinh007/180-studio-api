import { Query } from '@nestjs/cqrs'
import { ProjectView } from './list-project.view';

export class ListProjectQuery extends Query<ProjectView[]> {}
