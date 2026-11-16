import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ResponseDto } from '@/shared/presentation/dtos/response.dto'
import { AuthGuard } from '@/shared/presentation/guards/auth.guard'
import { CreateProjectRequest } from '../dtos/create-project.request.dto'
import { Roles } from '@/shared/presentation/decorators/role.decorator'
import { RoleGuard } from '@/shared/presentation/guards/role.guard'
import { Role } from '@/shared/domain/role.enum'
import { CommandBus } from '@nestjs/cqrs'
import { CreateProjectCommand } from '../../application/commands/create-project/create-project.command'
import { DeleteProjectCommand } from '../../application/commands/delete-project/delete-project.command'
import { PatchProjectRequest } from '../dtos/patch-project.request.dto'
import { PatchProjectCommand } from '@/modules/project/application/commands/patch-project/patch-project.command'

@Controller('projects')
@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
export class AdminProjectController {
  private readonly _commandBus: CommandBus

  constructor(commandBus: CommandBus) {
    this._commandBus = commandBus
  }

  @Post()
  async create(
    @Body() body: CreateProjectRequest,
  ): Promise<ResponseDto<{ projectId: string }>> {
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
        body.projectImages,
      ),
    )
    return new ResponseDto<{ projectId: string }>({
      message: 'Create project successfully',
      data: projectId,
    })
  }
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseDto<{ projectId: string }>> {
    const res = await this._commandBus.execute(new DeleteProjectCommand(id))
    return new ResponseDto<{ projectId: string }>({
      message: 'Delete project successfully',
      data: res,
    })
  }
  @Patch(':id')
  async patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: PatchProjectRequest,
  ): Promise<ResponseDto<null>> {
    const res = await this._commandBus.execute(
      new PatchProjectCommand(id, body),
    )
    return new ResponseDto<null>({
      message: 'Patch project successfully',
      data: null,
    })
  }
}
