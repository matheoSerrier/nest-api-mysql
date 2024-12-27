import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { AddUserToProjectDto } from "./dto/add-user-to-project.dto";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  findAll(@Query("page") page: number = 1, @Query("limit") limit: number = 10) {
    const parsedPage = parseInt(page.toString(), 10) || 1;
    const parsedLimit = parseInt(limit.toString(), 10) || 10;

    return this.projectService.findAll(parsedPage, parsedLimit);
  }

  @Get(":id")
  getProjectById(@Param("id", ParseIntPipe) id: number) {
    return this.projectService.getProjectById(id);
  }

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.projectService.delete(id);
  }

  @Post(":id/duplicate")
  createFrom(@Param("id", ParseIntPipe) id: number) {
    return this.projectService.createFrom(id);
  }

  @Post(":id/add-user")
  addUserToProject(
    @Param("id", ParseIntPipe) id: number,
    @Body() addUserToProjectDto: AddUserToProjectDto,
  ) {
    return this.projectService.addUserToProject(id, addUserToProjectDto.userId);
  }
}
