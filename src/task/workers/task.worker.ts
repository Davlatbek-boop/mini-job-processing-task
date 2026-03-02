import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { MockService } from '../../mock/mock.service';
import { TaskStatus } from '../../app.constants';

@Processor('task-queue')
export class TaskWorker extends WorkerHost {
  constructor(
    private readonly mockService: MockService,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {
    super();
  }

  async process(job: { data: { taskId: string } }) {
    const task = await this.taskRepo.findOne({ where: { id: job.data.taskId } });
    if (!task) return;

    if (task.status === TaskStatus.PROCESSING) return;

    try {
      task.status = TaskStatus.PROCESSING;
      task.started_at = new Date();
      task.attempts += 1;
      await this.taskRepo.save(task);

      const result = await this.mockService.processTask(task.payload);

      task.status = TaskStatus.COMPLETED;
      task.completed_at = new Date();
      await this.taskRepo.save(task);

      console.log('Task completed:', result);
    } catch (err) {
      task.last_error = (err as Error).message;

      if (task.attempts >= 3) {
        task.status = TaskStatus.FAILED;
      } else {
        task.status = TaskStatus.PENDING; 
      }

      await this.taskRepo.save(task);
      console.error('Task failed:', err);
    }
  }
}