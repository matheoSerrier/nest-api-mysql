import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post("login")
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }
    return this.authService.login(user);
  }

  @Post("register")
  async register(@Body() body: CreateUserDto) {
    const user = await this.userService.create(body);
    return this.authService.login(user);
  }
}
