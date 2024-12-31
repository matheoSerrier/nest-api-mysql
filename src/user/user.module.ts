import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserDetailsStrategy } from "./strategies/user-details.strategy";
import { UserFormatService } from "./strategies/user-format.service";
import { UserIndexStrategy } from "./strategies/user-index.strategy";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    UserIndexStrategy,
    UserDetailsStrategy,
    UserFormatService,
  ],
  exports: [UserService],
})
export class UserModule {}
