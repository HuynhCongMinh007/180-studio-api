import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HomeModule } from './modules/home/home.module';
import { ProjectModule } from './modules/projects/project.module';

@Module({
  imports: [DatabaseModule, HomeModule, ProjectModule],
})
export class AppModule { }
