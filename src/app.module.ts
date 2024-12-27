import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { ProjectModule } from "./project/project.module";
import { TaskModule } from "./task/task.module";
import { TagModule } from "./tag/tag.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "nest_db",
      autoLoadEntities: true,
      synchronize: false,
    }),
    UserModule,
    ProjectModule,
    TaskModule,
    TagModule,
    AuthModule,
  ],
})
export class AppModule {}
