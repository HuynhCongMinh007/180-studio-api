import { Controller, Get } from '@nestjs/common'
import { ListProjectsUseCase } from '@/modules/project/application/list-projects.use-case'
import { Project } from '@/modules/project/domain/entities/project.entity'
import { ProjectResponse } from '@/modules/project/presentation/dtos/project.response.dto'
import { toProjectResponse } from '@/modules/project/presentation/mappers/project-response.mapper'
import { ResponseDto } from '@/shared/presentation/dtos/response.dto'

@Controller('projects')
export class PublicProjectController {
  private readonly _listProjects: ListProjectsUseCase

  constructor(listProjects: ListProjectsUseCase) {
    this._listProjects = listProjects
  }

  @Get()
  async list(): Promise<ResponseDto<ProjectResponse[]>> {
    const projects: Project[] = await this._listProjects.execute()

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
