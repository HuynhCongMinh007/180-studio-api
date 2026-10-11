import { Module } from '@nestjs/common'
import { ListProjectsUseCase } from '@/modules/project/application/list-projects.use-case'
import { ProjectRepository } from '@/modules/project/domain/repositories/project.repository'
import { PrismaProjectRepository } from '@/modules/project/infrastructure/repositories/prisma-project.repository'
import { PublicProjectController } from '@/modules/project/presentation/controllers/public-project.controller'
import { AdminProjectController } from '@/modules/project/presentation/controllers/admin-project.controller'
import { CreateProjectUsecase } from './application/create-projects.use-case'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [JwtModule.register({})],
  controllers: [PublicProjectController, AdminProjectController],
  providers: [
    ListProjectsUseCase,
    CreateProjectUsecase,
    // Bind the domain contract to its Prisma implementation.
    { provide: ProjectRepository, useClass: PrismaProjectRepository },
  ],
})
export class ProjectModule {}
