import { Injectable } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { UserFormatStrategy } from "./user-format.strategy";

@Injectable()
export class UserFormatService {
  private strategy: UserFormatStrategy;

  setStrategy(strategy: UserFormatStrategy) {
    this.strategy = strategy;
  }

  transform(user: User): any {
    if (!this.strategy) {
      throw new Error("No strategy set");
    }
    return this.strategy.transform(user);
  }
}
