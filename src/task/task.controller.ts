import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksDto } from './dto/list-task.dto';
import { Request } from 'express';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Task } from './entities/task.entity';
import { Roles } from '../common/decorators/roles-auth.decorator';

@ApiTags('Tasks')
@Controller('task')
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}


  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: Task,
  })
  @ApiResponse({
    status: 409,
    description: 'Task with this idempotencyKey already exists',
  })
  create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    return this.taskService.createTask(createTaskDto, req['user'].id);
  }

  @Post(':id/cancel')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Cancel a pending task' })
  @ApiParam({ name: 'id', description: 'Task ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Task cancelled successfully',
    type: Task,
  })
  @ApiResponse({
    status: 400,
    description: 'Only PENDING tasks can be cancelled',
  })
  async cancelTask(@Param('id') id: string) {
    return this.taskService.cancelTask(id);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'List tasks' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by task status',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by task type',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter by created_at >= startDate (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter by created_at <= endDate (ISO string)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Pagination page',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Pagination limit',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'List of tasks', type: [Task] })
  async listTasks(@Query() query: ListTasksDto, @Req() req) {
    return this.taskService.listTasks(query, req['user']);
  }


  @Get('metrics')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get tasks metrics (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Metrics data',
    schema: {
      example: {
        totalTasks: 100,
        countsByStatus: {
          PENDING: 50,
          PROCESSING: 20,
          COMPLETED: 25,
          FAILED: 5,
        },
        averageProcessingTimeMs: 3500,
      },
    },
  })
  async getMetrics() {
    return this.taskService.getMetrics();
  }
}
