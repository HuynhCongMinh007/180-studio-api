import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common'
import { ProjectResponse } from '@/modules/project/presentation/dtos/project.response.dto'
import { toProjectResponse } from '@/modules/project/presentation/mappers/project-response.mapper'
import { ResponseDto } from '@/shared/presentation/dtos/response.dto'
import { QueryBus } from '@nestjs/cqrs'
import { ListProjectsQuery } from '../../application/queries/list-projects/list-projects.query'
import { ProjectView } from '../../application/queries/list-projects/project.view'
import { DetailProjectQuery } from '../../application/queries/project/project.query'
import { DetailProjectView } from '../../application/queries/project/project.vew'

@Controller('projects')
export class PublicProjectController {
  private readonly _queryBus: QueryBus

  constructor(queryBus: QueryBus) {
    this._queryBus = queryBus
  }

  @Get()
  async list(): Promise<ResponseDto<ProjectResponse[]>> {
    const projects: ProjectView[] = await this._queryBus.execute(
      new ListProjectsQuery(),
    )

    const projectResponses: ProjectResponse[] = projects.map((pro) =>
      toProjectResponse(pro),
    )

    return new ResponseDto<ProjectResponse[]>({
      message: 'Get projects successfully',
      data: projectResponses,
    })
  }
  
  @Get(':id')
  async getDetail(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseDto<DetailProjectView>> {
    const project: DetailProjectView = await this._queryBus.execute(
      new DetailProjectQuery(id),
    )
    return new ResponseDto<DetailProjectView>({
      message: 'Get detail proejct successfully',
      data: project,
    })
  }
}
