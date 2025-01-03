import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { User } from "../user/entities/user.entity";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { Tag } from "src/tag/entities/tag.entity";
import { Project } from "src/project/entities/project.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Tag, Project])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
