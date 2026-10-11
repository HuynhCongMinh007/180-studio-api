import { Module } from '@nestjs/common';
import { ListProjectsUseCase } from '@/modules/projects/application/list-projects.use-case';
import { ProjectRepository } from '@/modules/projects/domain/repositories/project.repository';
import { PrismaProjectRepository } from '@/modules/projects/infrastructure/repositories/prisma-project.repository';
import { PublicProjectController } from '@/modules/projects/presentation/controllers/public-project.controller';

@Module({
  controllers: [PublicProjectController],
  providers: [
    ListProjectsUseCase,
    // Bind the domain contract to its Prisma implementation.
    { provide: ProjectRepository, useClass: PrismaProjectRepository },
  ],
})
export class ProjectModule { }
