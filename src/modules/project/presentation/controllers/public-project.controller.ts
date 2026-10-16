import { Controller, Get } from '@nestjs/common'
import { Project } from '@/modules/project/domain/entities/project.entity'
import { ProjectResponse } from '@/modules/project/presentation/dtos/project.response.dto'
import { toProjectResponse } from '@/modules/project/presentation/mappers/project-response.mapper'
import { ResponseDto } from '@/shared/presentation/dtos/response.dto'
import { QueryBus } from '@nestjs/cqrs'
import { ListProjectQuery } from '../../application/queries/list-projects/list-projects.query'

@Controller('projects')
export class PublicProjectController {
  private readonly _queryBus: QueryBus

  constructor(queryBus: QueryBus) {
    this._queryBus = queryBus
  }

  @Get()
  async list(): Promise<ResponseDto<ProjectResponse[]>> {
    const projects: Project[] = await this._queryBus.execute(
      new ListProjectQuery(),
    )

    const projectResponses: ProjectResponse[] = []
    for (const project of projects) {
      projectResponses.push(toProjectResponse(project))
    }

    return new ResponseDto<ProjectResponse[]>({
      message: 'Get projects successfully',
      data: projectResponses,
    })
  }
}
