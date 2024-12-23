import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "./entities/project.entity";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { User } from "../user/entities/user.entity";
import { Task } from "../task/entities/task.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, Task])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
