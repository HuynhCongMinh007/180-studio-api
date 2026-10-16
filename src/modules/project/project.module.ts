import { Module } from '@nestjs/common'
import { ProjectRepository } from '@/modules/project/domain/repositories/project.repository'
import { PrismaProjectRepository } from '@/modules/project/infrastructure/repositories/prisma-project.repository'
import { PublicProjectController } from '@/modules/project/presentation/controllers/public-project.controller'
import { AdminProjectController } from '@/modules/project/presentation/controllers/admin-project.controller'
import { JwtModule } from '@nestjs/jwt'
import { ListProjectHandler } from './application/queries/list-projects/list-projects.handler'
import { CreateProjectHandler } from './application/commands/create-project/create-project.handler'

@Module({
  imports: [JwtModule.register({})],
  controllers: [PublicProjectController, AdminProjectController],
  providers: [
    ListProjectHandler,
    CreateProjectHandler,
    // Bind the domain contract to its Prisma implementation.
    { provide: ProjectRepository, useClass: PrismaProjectRepository },
  ],
})
export class ProjectModule {}
