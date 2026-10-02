import { Injectable } from "@nestjs/common";
import { ProjectRepository } from "@/modules/projects/domain/repositories/project.repository";
import { PrismaService } from "@/database/prisma.service";
import { Project } from "@/modules/projects/domain/entities/project.entity";
import { ProjectWithImagesRecord } from "@/modules/projects/infrastructure/records/project.record";
import { toProject } from "@/modules/projects/infrastructure/mappers/project.mapper";

@Injectable()
export class PrismaProjectRepository extends ProjectRepository {
    private readonly prisma: PrismaService

    constructor(prisma: PrismaService) {
        super()
        this.prisma = prisma
    }

    async findAllProjects(): Promise<Project[]> {
        const records: ProjectWithImagesRecord[] = await this.prisma.project.findMany(
            {
                include: {
                    projectImages: {
                        orderBy:{coverPriority:'asc'}
                    }
                },
                orderBy: [{createdAt:'asc'}]
            }
        )
        
        const projects: Project[] = []
        for (const record of records) {
            const project: Project = toProject(record)
            projects.push(project)
        }
        return projects
    }
}