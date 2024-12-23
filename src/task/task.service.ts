import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "../user/entities/user.entity";
import { Task } from "./entities/task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      relations: ["project", "assignedUsers"], // Charge les relations nécessaires
    });
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
}
