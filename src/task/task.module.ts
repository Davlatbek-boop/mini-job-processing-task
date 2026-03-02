import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { BullModule } from '@nestjs/bullmq';
import { TaskWorker } from './workers/task.worker';
import { MockModule } from '../mock/mock.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    BullModule.registerQueue({
      name: 'task-queue',
    }),
    MockModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskWorker],
})
export class TaskModule {}
