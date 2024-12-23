import { DataSource } from "typeorm";
import { User } from "./src/user/entities/user.entity";
import { Project } from "./src/project/entities/project.entity";
import { Task } from "src/task/entities/task.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "nest_db",
  entities: [User, Project, Task],
  migrations: ["src/migration/*.ts"],
  synchronize: false,
});
