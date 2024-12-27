import { Controller, Get, Post, Body, Query } from "@nestjs/common";
import { TagService } from "./tag.service";
import { CreateTagDto } from "./dto/create-tag.dto";

@Controller("tags")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    const parsedPage = parseInt(page.toString(), 10) || 1;
    const parsedLimit = parseInt(limit.toString(), 10) || 10;

    return this.tagService.findAll(parsedPage, parsedLimit);
  }

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    console.log("Requête reçue dans le contrôleur :", createTagDto);
    return this.tagService.create(createTagDto);
  }
}
