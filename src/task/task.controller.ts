import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  Query,
} from "@nestjs/common";
import { AssignUsersDto } from "./dto/assign-users.dto";
import { TaskService } from "./task.service";

@Controller("tasks")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("title") title?: string,
    @Query("isCompleted") isCompleted?: string,
    @Query("orderBy") orderBy?: "ASC" | "DESC"
  ) {
    const parsedPage = parseInt(page.toString(), 10) || 1;
    const parsedLimit = parseInt(limit.toString(), 10) || 10;

    const filters = {
      title,
      isCompleted:
        isCompleted !== undefined ? isCompleted === "true" : undefined,
    };

    return this.taskService.findAll(parsedPage, parsedLimit, filters, orderBy);
  }

  @Get(":slug")
  findBySlug(@Param("slug") slug: string) {
    return this.taskService.findBySlug(slug);
  }

  @Post(":slug/assign-users")
  assignUsersToTask(
    @Param("slug") slug: string,
    @Body() assignUsersDto: AssignUsersDto
  ) {
    return this.taskService.assignUsersToTask(slug, assignUsersDto.userSlugs);
  }

  @Delete(":slug")
  softDelete(@Param("slug") slug: string) {
    return this.taskService.softDelete(slug);
  }

  @Put(":slug/restore")
  restore(@Param("slug") slug: string) {
    return this.taskService.restore(slug);
  }

  @Post(":slug/assign-tags")
  assignTagsToTask(
    @Param("slug") slug: string,
    @Body("tags") tagNames: string[]
  ) {
    return this.taskService.assignTagsToTask(slug, tagNames);
  }

  @Post()
  async createTask(
    @Body("projectSlug") projectSlug: string,
    @Body("title") title: string | null,
    @Body("description") description: string | null,
    @Body("tags") tagNames?: string[]
  ) {
    return this.taskService.createTask(projectSlug, title, description, tagNames);
  }
}