import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HomeModule } from './modules/home/home.module';

@Module({
  imports: [DatabaseModule, HomeModule],
})
export class AppModule { }
