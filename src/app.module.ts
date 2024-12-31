import { Module, MiddlewareConsumer } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "./user/user.module";
import { ProjectModule } from "./project/project.module";
import { TaskModule } from "./task/task.module";
import { TagModule } from "./tag/tag.module";
import { AuthModule } from "./auth/auth.module";
import { AuthMiddleware } from "./auth/auth.middleware";
import { CategoryModule } from "./category/category.module";

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
    JwtModule.register({
      secret: process.env.JWT_SECRET || "default_secret",
      signOptions: { expiresIn: "8h" },
    }),
    UserModule,
    ProjectModule,
    TaskModule,
    TagModule,
    AuthModule,
    CategoryModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("*"); // Applique le middleware globalement
  }
}
