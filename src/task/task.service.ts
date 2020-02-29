import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository) {
  }

  async getTasks(
    filterDto: GetTaskFilterDto,
    user: User,
  ): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(
    id: number,
    user: User,
  ): Promise<Task> {
    const found = await this.taskRepository.findOne(
      {
        where: {
          id, userId: user.id,
        },
      });

    if (!found) {
      throw new NotFoundException;
    }
    return found;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ) {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTask(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(
    id: number,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.isDeleted = true;
    await task.save();
    return task;
  }
}
