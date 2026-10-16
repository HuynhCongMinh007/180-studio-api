import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ResponseDto } from '@/shared/presentation/dtos/response.dto'
import { AuthGuard } from '@/shared/presentation/guards/auth.guard'
import { CreateProjectRequest } from '../dtos/project.request.dto'
import { Roles } from '@/shared/presentation/decorators/role.decorator'
import { RoleGuard } from '@/shared/presentation/guards/role.guard'
import { Role } from '@/shared/domain/role.enum'
import { CommandBus } from '@nestjs/cqrs'
import { CreateProjectCommand } from '../../application/commands/create-project/create-project.command'

@Controller('projects')
@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
export class AdminProjectController {
  private readonly _commandBus: CommandBus

  constructor(commandBus: CommandBus) {
    this._commandBus = commandBus
  }

  @Post()
  async create(@Body() body: CreateProjectRequest): Promise<ResponseDto<string>> {
    const projectId = await this._commandBus.execute(
      new CreateProjectCommand(
        body.name,
        body.year,
        body.location,
        body.siteArea,
        body.floorArea,
        body.client,
        body.photographer,
        body.videoUrl,
        body.projectImages.map((img) => ({
          imageUrl: img.imageUrl,
          coverPriority: img.coverPriority ?? null,
        })),
      ),
    )
    return new ResponseDto<string>({
      message: 'Create project successfully',
      data: projectId,
    })
  }
}
