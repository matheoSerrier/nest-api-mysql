import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query("page") page: number = 1, @Query("limit") limit: number = 10) {
    const parsedPage = parseInt(page.toString(), 10) || 1;
    const parsedLimit = parseInt(limit.toString(), 10) || 10;

    return this.userService.findAll(parsedPage, parsedLimit);
  }

  @Get(":slug")
  findOne(
    @Param("slug") slug: string,
    @Query("format") format: "index" | "details" = "details",
  ) {
    return this.userService.findOneBySlug(slug, format);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }
}
