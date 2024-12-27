import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tag } from "./entities/tag.entity";
import { CreateTagDto } from "./dto/create-tag.dto";

import { applyPagination, PaginationResult } from "../utils/pagination.util";


@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginationResult<Tag>> {
    const [tags, total] = await this.tagRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return applyPagination(tags, total);
  }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    console.log("DTO dans le service :", createTagDto);

    const tag = this.tagRepository.create(createTagDto);
    console.log("Objet créé avant sauvegarde :", tag);

    return this.tagRepository.save(tag);
  }
}
