import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Delete,
    Put,
    Query
  } from '@nestjs/common';
  import { AssignUsersDto } from './dto/assign-users.dto';
  import { TaskService } from './task.service';
  
  @Controller('tasks')
  export class TaskController {
    constructor(private readonly taskService: TaskService) {}
  
    // Récupérer toutes les tâches
    @Get()
    async findAll(
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 10,
    ) {
        const parsedPage = parseInt(page.toString(), 10) || 1;
        const parsedLimit = parseInt(limit.toString(), 10) || 10;

        // Appelle le service avec les paramètres paginés
        return this.taskService.findAll(parsedPage, parsedLimit);
    }
  
    // Récupérer une tâche par son ID
    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number) {
      return this.taskService.findById(id);
    }
  
    // Assigner des utilisateurs à une tâche
    @Post(':id/assign-users')
    assignUsersToTask(
      @Param('id', ParseIntPipe) id: number,
      @Body() assignUsersDto: AssignUsersDto,
    ) {
      return this.taskService.assignUsersToTask(id, assignUsersDto.userIds);
    }

    @Delete(':id')
    softDelete(@Param('id', ParseIntPipe) id: number) {
        return this.taskService.softDelete(id);
    }

    @Put(':id/restore')
    restore(@Param('id', ParseIntPipe) id: number) {
        return this.taskService.restore(id);
    }
  }
  