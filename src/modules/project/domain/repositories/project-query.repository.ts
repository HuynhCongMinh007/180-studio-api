import { ProjectSummary } from '@/modules/project/domain/read-models/project-summary'
import { ProjectDetail } from '@/modules/project/domain/read-models/project-detail'

export abstract class ProjectQueryRepository {
  abstract findAll(
    page: number,
    limit: number,
  ): Promise<{ items: ProjectSummary[]; total: number }>
  abstract findOne(id: string): Promise<ProjectDetail | null>
}
