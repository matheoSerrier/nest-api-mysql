import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import { applyPagination, PaginationResult } from "../utils/pagination.util";
import { UserSummaryDto } from "./dto/user-summary.dto";
import { UserFormatService } from "./strategies/user-format.service";
import { UserIndexStrategy } from "./strategies/user-index.strategy";
import { UserDetailsStrategy } from "./strategies/user-details.strategy";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userFormatService: UserFormatService,
    private readonly userIndexStrategy: UserIndexStrategy,
    private readonly userDetailsStrategy: UserDetailsStrategy,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginationResult<UserSummaryDto>> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      slug: user.slug,
      email: user.email,
    }));

    return applyPagination(formattedUsers, total);
  }

  async findOneBySlug(slug: string, format: "index" | "details") {
    const user = await this.userRepository.findOne({ where: { slug } });
    if (!user) {
      throw new NotFoundException(`User with slug ${slug} not found`);
    }

    // Choix de la stratégie en fonction du format
    if (format === "index") {
      this.userFormatService.setStrategy(this.userIndexStrategy);
    } else if (format === "details") {
      this.userFormatService.setStrategy(this.userDetailsStrategy);
    } else {
      throw new Error("Invalid format");
    }

    return this.userFormatService.transform(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  private async generateUniqueSlug(
    firstname: string,
    lastname: string,
  ): Promise<string> {
    let slug = `@${firstname.toLowerCase()}${lastname.toLowerCase()}`;
    let suffix = 1;

    while (await this.userRepository.findOne({ where: { slug } })) {
      slug = `@${firstname.toLowerCase()}${lastname.toLowerCase()}${suffix}`;
      suffix++;
    }

    return slug;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const slug = await this.generateUniqueSlug(
      createUserDto.firstname,
      createUserDto.lastname,
    );

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      slug,
    });

    return this.userRepository.save(user); // Retourne l'entité complète
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserSummaryDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    return {
      id: updatedUser.id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      slug: updatedUser.slug,
      email: updatedUser.email,
    };
  }
}
