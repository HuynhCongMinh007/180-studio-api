import {
  ProjectDetail,
  ProjectSummary,
} from '@/modules/project/domain/types/project-summary'

export abstract class ProjectQueryRepository {
  abstract findAll(): Promise<ProjectSummary[]>
  abstract findOne(id: string): Promise<ProjectDetail | null>
}
