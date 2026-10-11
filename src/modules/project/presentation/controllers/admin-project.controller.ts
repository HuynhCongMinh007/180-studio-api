import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ResponseDto } from '@/shared/presentation/dtos/response.dto'
import { AuthGuard } from '@/shared/presentation/guards/auth.guard'
import { CreateProjectUsecase } from '../../application/create-projects.use-case'
import { CreateProjectRequest } from '../dtos/project.request.dto'
import { toCreateProjectInput } from '../mappers/create-project-request.mapper'

@Controller('projects')
@UseGuards(AuthGuard)
export class AdminProjectController {
  private readonly _createProject: CreateProjectUsecase

  constructor(createProject: CreateProjectUsecase) {
    this._createProject = createProject
  }

  @Post()
  async create(@Body() body: CreateProjectRequest): Promise<ResponseDto<null>> {
    await this._createProject.execute(toCreateProjectInput(body))
    return new ResponseDto<null>({
      message: 'Create project successfully',
      data: null,
    })
  }
}

