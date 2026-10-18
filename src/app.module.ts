import { Module } from '@nestjs/common'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './modules/auth/auth.module'
import { HomeModule } from './modules/home/home.module'
import { ProjectModule } from './modules/project/project.module'
import { CqrsModule } from '@nestjs/cqrs'
import { LoggingCommandPublisher } from './shared/application/cqrs/logging-command.publisher'

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    HomeModule,
    ProjectModule,
    CqrsModule.forRoot({ commandPublisher: new LoggingCommandPublisher() }),
  ],
})
export class AppModule {}
