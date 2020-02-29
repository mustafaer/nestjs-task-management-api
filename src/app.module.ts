import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TaskModule,
    AuthModule,
  ],
})
export class AppModule {
}
