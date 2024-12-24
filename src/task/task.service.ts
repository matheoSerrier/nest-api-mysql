import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "../user/entities/user.entity";
import { Task } from "./entities/task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaginationResultDto } from "./dto/pagination-result.dto";
import { TaskIndexDto } from "./dto/task-index.dto";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginationResultDto<TaskIndexDto>> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      where: { deletedAt: null },
      relations: ['project', 'assignedUsers'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedTasks = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      isCompleted: task.isCompleted,
      project: {
        id: task.project.id,
        name: task.project.name,
      },
      assignedUsers: task.assignedUsers.map((user) => ({
        id: user.id,
        name: user.name,
      })),
    }));

    return { data: formattedTasks, total };
  }

  async findById(taskId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ["project", "assignedUsers"], // Charge le projet et les utilisateurs assignés
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return task;
  }

  // Ajouter des utilisateurs à une task
  async assignUsersToTask(taskId: number, userIds: number[]): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ["assignedUsers"],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const users = await this.userRepository.findByIds(userIds);
    task.assignedUsers = [...task.assignedUsers, ...users];
    return this.taskRepository.save(task);
  }

  async softDelete(taskId: number): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, deletedAt: null }, // Vérifie que la tâche n'est pas déjà supprimée
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    await this.taskRepository.softDelete(taskId); // Effectue un soft delete
  }

  async restore(taskId: number): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId }, // Inclut les tâches supprimées
      withDeleted: true, // Charge les tâches supprimées
    });

    if (!task || !task.deletedAt) {
      throw new NotFoundException(
        `Task with ID ${taskId} is not deleted or does not exist`,
      );
    }

    await this.taskRepository.restore(taskId); // Restaure la tâche
  }
}
