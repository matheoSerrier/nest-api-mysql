import { Injectable } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { UserDetailsDto } from "../dto/user.dto";
import { UserFormatStrategy } from "./user-format.strategy";

@Injectable()
export class UserDetailsStrategy implements UserFormatStrategy {
  transform(user: User): UserDetailsDto {
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      slug: user.slug,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
