import { Module } from '@nestjs/common'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './modules/auth/auth.module'
import { HomeModule } from './modules/home/home.module'
import { ProjectModule } from './modules/project/project.module'

@Module({
  imports: [DatabaseModule, AuthModule, HomeModule, ProjectModule],
})
export class AppModule {}
