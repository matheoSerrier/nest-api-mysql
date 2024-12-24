import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Delete,
    Put
  } from '@nestjs/common';
  import { AssignUsersDto } from './dto/assign-users.dto';
  import { TaskService } from './task.service';
  
  @Controller('tasks')
  export class TaskController {
    constructor(private readonly taskService: TaskService) {}
  
    // Récupérer toutes les tâches
    @Get()
    findAll() {
      return this.taskService.findAll();
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
  