import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { ProjectModule } from "./project/project.module";
import { TaskModule } from "./task/task.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "", // Mot de passe par défaut de XAMPP
      database: "nest_db",
      autoLoadEntities: true,
      synchronize: false, // On utilise des migrations pour éviter synchronize: true
    }),
    UserModule,
    ProjectModule,
    TaskModule,
  ],
})
export class AppModule {}
