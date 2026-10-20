import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ListProjectsRequest } from '@/modules/project/presentation/dtos/list-projects.request.dto'
import {
  PaginationMeta,
  ResponseDto,
} from '@/shared/presentation/dtos/response.dto'
import { ListProjectsQuery } from '../../application/queries/list-projects/list-projects.query'
import { GetProjectQuery } from '../../application/queries/get-project/get-project.query'
import { ProjectDetailView } from '../../application/queries/get-project/project-detail.view'
import { ProjectView } from '../../application/queries/list-projects/project.view'

@Controller('projects')
export class PublicProjectController {
  private readonly _queryBus: QueryBus

  constructor(queryBus: QueryBus) {
    this._queryBus = queryBus
  }

  @Get()
  async list(
    @Query() query: ListProjectsRequest,
  ): Promise<ResponseDto<ProjectView[]>> {
    const { items, total } = await this._queryBus.execute(
      new ListProjectsQuery(query.page, query.limit),
    )

    const totalPages = Math.ceil(total / query.limit)
    const pagination: PaginationMeta = {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      nextPage: query.page < totalPages ? query.page + 1 : null,
      prevPage: query.page > 1 ? query.page - 1 : null,
    }

    return new ResponseDto<ProjectView[]>({
      message: 'Get projects successfully',
      data: items,
      metadata: pagination,
    })
  }

  @Get(':id')
  async getDetail(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseDto<ProjectDetailView>> {
    const project = await this._queryBus.execute(new GetProjectQuery(id))
    return new ResponseDto<ProjectDetailView>({
      message: 'Get project detail successfully',
      data: project,
    })
  }
}
