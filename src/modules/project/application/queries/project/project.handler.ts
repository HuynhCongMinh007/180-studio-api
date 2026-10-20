import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { DetailProjectQuery } from './project.query'
import { DetailProjectView } from './project.vew'
import { TransactionManager } from '@/shared/domain/transactions/transaction-manager'
import { ProjectQueryRepository } from '@/modules/project/domain/repositories/project-query.repository'
import { ProjectNotFoundError } from './project.error'
import { toDetailProjectView } from './project.mapper'

@QueryHandler(DetailProjectQuery)
export class DetailProjectHandler implements IQueryHandler<DetailProjectQuery> {
  constructor(
    private readonly transactionManager: TransactionManager,
    private readonly projectQueryRepository: ProjectQueryRepository,
  ) {}

  async execute(query: DetailProjectQuery): Promise<DetailProjectView> {
    const project = await this.projectQueryRepository.findOne(query.projectId)
    if (!project) {
      throw new ProjectNotFoundError(`Not foud project ${query.projectId}`)
    }
    const res = toDetailProjectView(project)
    return res
  }
}
