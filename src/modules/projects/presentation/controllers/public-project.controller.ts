import { Controller, Get } from "@nestjs/common";
import { ListProjectsUseCase } from "@/modules/projects/application/list-projects.use-case";
import { Project } from "@/modules/projects/domain/entities/project.entity";
import { ProjectResponse } from "@/modules/projects/presentation/dtos/project.response.dto";
import { toProjectResponse } from "@/modules/projects/presentation/mappers/project-response.mapper";
import { ResponseDto } from "@/shared/presentation/dtos/response.dto";

@Controller()
export class PublicProjectController {
    private readonly _listProjects: ListProjectsUseCase

    constructor(listProjects: ListProjectsUseCase) {
        this._listProjects = listProjects
    }

    @Get('/projects')
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
