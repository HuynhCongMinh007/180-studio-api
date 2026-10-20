import { Module } from '@nestjs/common'
import { ProjectRepository } from '@/modules/project/domain/repositories/project.repository'
import { ProjectQueryRepository } from '@/modules/project/domain/repositories/project-query.repository'
import { PrismaProjectQueryRepository } from '@/modules/project/infrastructure/repositories/prisma-project-query.repository'
import { PrismaProjectRepository } from '@/modules/project/infrastructure/repositories/prisma-project.repository'
import { PublicProjectController } from '@/modules/project/presentation/controllers/public-project.controller'
import { AdminProjectController } from '@/modules/project/presentation/controllers/admin-project.controller'
import { JwtModule } from '@nestjs/jwt'
import { ListProjectsHandler } from './application/queries/list-projects/list-projects.handler'
import { CreateProjectHandler } from './application/commands/create-project/create-project.handler'
import { ProjectCreatedHandler } from './application/events/project-created/project-created.handler'
import { DeleteProjectHandler } from './application/commands/delete-project/delete-project.handler'
import { ProjectDeletedHandler } from './application/events/project-deleted/project-deleted.handler'
import { GetProjectHandler } from './application/queries/get-project/get-project.handler'

@Module({
  imports: [JwtModule.register({})],
  controllers: [PublicProjectController, AdminProjectController],
  providers: [
    ListProjectsHandler,
    CreateProjectHandler,
    ProjectCreatedHandler,
    DeleteProjectHandler,
    ProjectDeletedHandler,
    GetProjectHandler,
    // Bind the domain contract to its Prisma implementation.
    { provide: ProjectRepository, useClass: PrismaProjectRepository },
    {
      provide: ProjectQueryRepository,
      useClass: PrismaProjectQueryRepository,
    },
  ],
})
export class ProjectModule {}
