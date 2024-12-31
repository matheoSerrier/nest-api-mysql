import { User } from "../entities/user.entity";

export interface UserFormatStrategy {
  transform(user: User): any;
}
