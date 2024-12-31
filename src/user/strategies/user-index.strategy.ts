import { Injectable } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { UserIndexDto } from "../dto/user.dto";
import { UserFormatStrategy } from "./user-format.strategy";

@Injectable()
export class UserIndexStrategy implements UserFormatStrategy {
  transform(user: User): UserIndexDto {
    return {
      firstname: user.firstname,
      lastname: user.lastname,
      slug: user.slug,
    };
  }
}
