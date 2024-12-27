import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "./entities/tag.entity";
import { TagService } from "./tag.service";
import { TagController } from "./tag.controller";
import { Task } from "../task/entities/task.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Task])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
