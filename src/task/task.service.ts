import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { DataSource, Repository } from 'typeorm';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { TaskPriority } from '../app.constants';
import { ListTasksDto } from './dto/list-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    private readonly dataSource: DataSource,
    @InjectQueue('task-queue') private readonly taskQueue: Queue,
  ) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    return await this.dataSource.transaction(async (manager) => {
      const existing = await manager.findOne(Task, {
        where: { idempotency_key: createTaskDto.idempotencyKey },
      });
      if (existing) {
        throw new ConflictException(
          'Task with this idempotencyKey already exists',
        );
      }

      const taskPriority = createTaskDto.priority.toUpperCase() as TaskPriority;

      const task = manager.create(Task, {
        user_id: '0a374416-cbf8-455e-b328-be4dc260df4c',
        type: createTaskDto.type,
        priority: taskPriority,
        payload: createTaskDto.payload,
        idempotency_key: createTaskDto.idempotencyKey,
        scheduled_at: createTaskDto.scheduledAt
          ? new Date(
              new Date(createTaskDto.scheduledAt).getTime() -
                5 * 60 * 60 * 1000,
            ) // +5
          : undefined,
      });

      await manager.save(task);

      let delay = 0;
      if (task.scheduled_at) {
        delay = Math.max(task.scheduled_at.getTime() - Date.now(), 0);
      }

      const priorityMap = {
        HIGH: 1,
        NORMAL: 5,
        LOW: 10,
      };
      const bullPriority = priorityMap[task.priority] ?? 5;

      await this.taskQueue.add(
        'process-task',
        { taskId: task.id },
        {
          delay,
          priority: bullPriority,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );

      return task;
    });
  }

  async cancelTask(taskId: string) {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    if (task.status !== 'PENDING') {
      throw new BadRequestException('Only PENDING tasks can be cancelled');
    }

    const jobs = await this.taskQueue.getJobs(['delayed', 'waiting']);
    const jobToRemove = jobs.find((j) => j.data.taskId === taskId);
    if (jobToRemove) {
      await jobToRemove.remove();
    }

    task.status = 'CANCELLED' as any;
    await this.taskRepo.save(task);

    return { message: `Task ${taskId} cancelled successfully` };
  }

  async listTasks(query: ListTasksDto, user: any) {
    const { status, type, startDate, endDate, page = 1, limit = 10 } = query;

    const where: any = {};

    if (!user.isAdmin) {
      where.user_id = user.id;
    }

    if (status) where.status = status;
    if (type) where.type = type;

    let dateFilter: any = {};
    if (startDate) dateFilter['$gte'] = new Date(startDate);
    if (endDate) dateFilter['$lte'] = new Date(endDate);
    if (Object.keys(dateFilter).length > 0) {
      where.created_at = dateFilter;
    }

    const [tasks, total] = await this.taskRepo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


  async getMetrics() {
    const total = await this.taskRepo.count();

    const statusCounts = await this.taskRepo
      .createQueryBuilder('task')
      .select('task.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('task.status')
      .getRawMany();

    const avgProcessingTimes = await this.taskRepo
      .createQueryBuilder('task')
      .select('AVG(EXTRACT(EPOCH FROM (task.completed_at - task.started_at)) * 1000)', 'avg_ms')
      .where('task.completed_at IS NOT NULL')
      .getRawOne();

    return {
      totalTasks: total,
      countsByStatus: statusCounts.reduce((acc, cur) => {
        acc[cur.status] = parseInt(cur.count, 10);
        return acc;
      }, {} as Record<string, number>),
      avgProcessingTimeMs: parseFloat(avgProcessingTimes.avg_ms) || 0,
    };
  }

}
