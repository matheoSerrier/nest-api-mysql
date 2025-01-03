import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { User } from "../user/entities/user.entity";
import { Task } from "./entities/task.entity";
import { Tag } from "../tag/entities/tag.entity";
import { Project } from "src/project/entities/project.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { TaskIndexDto } from "./dto/task-index.dto";
import {
  applyPagination,
  PaginationResult,
} from "../utils/pagination.util";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) {}

  async findAll(
    page: number,
    limit: number,
    filters?: { title?: string; isCompleted?: boolean },
    orderBy?: "ASC" | "DESC"
  ): Promise<PaginationResult<TaskIndexDto>> {
    const { title, isCompleted } = filters || {};

    const [tasks, total] = await this.taskRepository.findAndCount({
      where: {
        deletedAt: null,
        ...(title && { title: Like(`%${title}%`) }),
        ...(typeof isCompleted === "boolean" && { isCompleted }),
      },
      order: {
        title: orderBy || "ASC",
      },
      relations: ["project", "assignedUsers"],
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedTasks = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      slug: task.slug,
      description: task.description,
      isCompleted: task.isCompleted,
      project: {
        id: task.project.id,
        name: task.project.name,
        slug: task.project.slug,
      },
      assignedUsers: task.assignedUsers.map((user) => ({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        slug: user.slug,
      })),
    }));

    return applyPagination(formattedTasks, total);
  }

  async findBySlug(taskSlug: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { slug: taskSlug },
      relations: ["project", "assignedUsers"],
    });

    if (!task) {
      throw new NotFoundException(`Task with Slug ${taskSlug} not found`);
    }

    return task;
  }

  async assignUsersToTask(taskSlug: string, userSlugs: string[]): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { slug: taskSlug },
      relations: ["assignedUsers"],
    });

    if (!task) {
      throw new NotFoundException(`Task with Slug ${taskSlug} not found`);
    }

    const users = await Promise.all(
      userSlugs.map(async (slug) => {
        const user = await this.userRepository.findOne({ where: { slug } });
        if (!user) {
          throw new NotFoundException(`User with Slug ${slug} not found`);
        }
        return user;
      })
    );

    task.assignedUsers = [...task.assignedUsers, ...users];
    return this.taskRepository.save(task);
  }

  async createTask(
    projectSlug: string,
    title: string | null,
    description: string | null,
    tagNames?: string[]
  ): Promise<Task> {
    if (!projectSlug) {
      throw new BadRequestException("ProjectSlug is required to create a task");
    }

    const project = await this.projectRepository.findOne({
      where: { slug: projectSlug },
    });

    if (!project) {
      throw new NotFoundException(`Project with Slug ${projectSlug} not found`);
    }

    const taskTitle = title || "Default Task Title";
    const tags = tagNames ? await Promise.all(
      tagNames.map(async (name) => {
        let tag = await this.tagRepository.findOne({ where: { name } });
        if (!tag) {
          tag = this.tagRepository.create({ name });
          tag = await this.tagRepository.save(tag);
        }
        return tag;
      })
    ) : [];

    const task = this.taskRepository.create({
      title: taskTitle,
      description,
      project,
      tags,
      slug: taskTitle.toLowerCase().replace(/\s+/g, "-"),
    });

    return this.taskRepository.save(task);
  }

  async softDelete(taskSlug: string): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { slug: taskSlug, deletedAt: null },
    });

    if (!task) {
      throw new NotFoundException(`Task with Slug ${taskSlug} not found`);
    }

    await this.taskRepository.softDelete({ slug: taskSlug });
  }

  async restore(taskSlug: string): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { slug: taskSlug },
      withDeleted: true,
    });

    if (!task || !task.deletedAt) {
      throw new NotFoundException(
        `Task with Slug ${taskSlug} is not deleted or does not exist`
      );
    }

    await this.taskRepository.restore({ slug: taskSlug });
  }

  async assignTagsToTask(taskSlug: string, tagNames: string[]): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { slug: taskSlug },
      relations: ["tags"],
    });

    if (!task) {
      throw new NotFoundException(`Task with Slug ${taskSlug} not found`);
    }

    const tags = await Promise.all(
      tagNames.map(async (name) => {
        let tag = await this.tagRepository.findOne({ where: { name } });
        if (!tag) {
          tag = this.tagRepository.create({ name });
          tag = await this.tagRepository.save(tag);
        }
        return tag;
      })
    );

    task.tags = [...task.tags, ...tags];
    return this.taskRepository.save(task);
  }
}
