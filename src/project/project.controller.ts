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
  Request
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { AddUserToProjectDto } from "./dto/add-user-to-project.dto";
import { AuthenticatedRequest } from "src/types/express-request.interface";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  findAll(
    @Query("page", new ParseIntPipe({ errorHttpStatusCode: 400 })) page: number = 1,
    @Query("limit", new ParseIntPipe({ errorHttpStatusCode: 400 })) limit: number = 10,
  ) {
    return this.projectService.findAll(page, limit);
  }
  
  @Get("owner")
  findProjectsByOwner(
    @Request() req: AuthenticatedRequest,
    @Query("page", new ParseIntPipe({ errorHttpStatusCode: 400 })) page: number = 1,
    @Query("limit", new ParseIntPipe({ errorHttpStatusCode: 400 })) limit: number = 10,
  ) {
    return this.projectService.findProjectsByOwner(req.user.id, page, limit);
  }

  @Get("participant")
  findProjectsByParticipant(
    @Request() req: AuthenticatedRequest,
    @Query("page", new ParseIntPipe({ errorHttpStatusCode: 400 })) page: number = 1,
    @Query("limit", new ParseIntPipe({ errorHttpStatusCode: 400 })) limit: number = 10,
  ) {
    return this.projectService.findProjectsByParticipant(req.user.id, page, limit);
  }

  @Get("category/:categoryId")
  findProjectsByCategory(
    @Param("categoryId", ParseIntPipe) categoryId: number,
    @Query("page", new ParseIntPipe({ errorHttpStatusCode: 400 })) page: number = 1,
    @Query("limit", new ParseIntPipe({ errorHttpStatusCode: 400 })) limit: number = 10,
  ) {
    return this.projectService.findProjectsByCategory(categoryId, page, limit);
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
