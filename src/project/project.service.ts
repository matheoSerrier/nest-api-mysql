import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from "./entities/project.entity";
import { User } from "../user/entities/user.entity";
import { Task } from "../task/entities/task.entity";
import { Category } from "src/category/entities/category.entity";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectSummaryDto } from "./dto/project-summary.dto";

import { applyPagination, PaginationResult } from "../utils/pagination.util";
import dayjs from "dayjs";
@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>, 
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // Récupérer tous les projets
  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginationResult<ProjectSummaryDto>> {
    const [projects, total] = await this.projectRepository.findAndCount({
      relations: ["owner", "participants", "category"],
      skip: (page - 1) * limit,
      take: limit,
    });

    // Mapper les données vers les DTOs
    const formattedProjects = projects.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      startDate: project.startDate
        ? dayjs(project.startDate).format("YYYY-MM-DD")
        : null,
      endDate: project.endDate
        ? dayjs(project.endDate).format("YYYY-MM-DD")
        : null,
      owner: {
        id: project.owner.id,
        firstname: project.owner.firstname,
        lastname: project.owner.lastname,
        slug: project.owner.slug,
        email: project.owner.email,
      },
      participants: project.participants.map((participant) => ({
        id: participant.id,
        firstname: participant.firstname,
        lastname: participant.lastname,
        slug: participant.slug,
        email: participant.email,
      })),
      category: project.category
        ? {
            id: project.category.id,
            name: project.category.name,
          }
        : null,
    }));

    return applyPagination(formattedProjects, total);
  }

  // Récupérer un projet par son ID avec ses participants
  async getProjectById(id: number): Promise<ProjectSummaryDto> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ["owner", "participants", "category"],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Mapper le projet vers le DTO
    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      startDate: project.startDate
        ? dayjs(project.startDate).format("YYYY-MM-DD")
        : null,
      endDate: project.endDate
        ? dayjs(project.endDate).format("YYYY-MM-DD")
        : null,
      owner: {
        id: project.owner.id,
        firstname: project.owner.firstname,
        lastname: project.owner.lastname,
        slug: project.owner.slug,
        email: project.owner.email,
      },
      participants: project.participants.map((participant) => ({
        id: participant.id,
        firstname: participant.firstname,
        lastname: participant.lastname,
        slug: participant.slug,
        email: participant.email,
      })),
      category: project.category
        ? {
            id: project.category.id,
            name: project.category.name,
          }
        : null,
    };
  }

  async getProjectBySlug(slug: string): Promise<ProjectSummaryDto> {
    const project = await this.projectRepository.findOne({
      where: { slug },
      relations: ["owner", "participants", "category"],
    });
  
    if (!project) {
      throw new NotFoundException(`Project with slug "${slug}" not found`);
    }
  
    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      startDate: project.startDate
        ? dayjs(project.startDate).format("YYYY-MM-DD")
        : null,
      endDate: project.endDate
        ? dayjs(project.endDate).format("YYYY-MM-DD")
        : null,
      owner: {
        id: project.owner.id,
        firstname: project.owner.firstname,
        lastname: project.owner.lastname,
        slug: project.owner.slug,
        email: project.owner.email,
      },
      participants: project.participants.map((participant) => ({
        id: participant.id,
        firstname: participant.firstname,
        lastname: participant.lastname,
        slug: participant.slug,
        email: participant.email,
      })),
      category: project.category
        ? {
            id: project.category.id,
            name: project.category.name,
          }
        : null,
    };
  }  

  private async generateUniqueSlug(name: string): Promise<string> {
    let slug = name.toLowerCase().replace(/\s+/g, '-'); // Convertir en minuscule et remplacer les espaces par des tirets
    let suffix = 1;
  
    while (await this.projectRepository.findOne({ where: { slug } })) {
      slug = `${slug}-${suffix}`;
      suffix++;
    }
  
    return slug;
  }  

  async create(createProjectDto: CreateProjectDto): Promise<ProjectSummaryDto> {
    const owner = await this.userRepository.findOneBy({
      id: createProjectDto.ownerId,
    });
    if (!owner) {
      throw new NotFoundException(
        `Owner with ID ${createProjectDto.ownerId} not found`,
      );
    }

    let category: Category | null = null;
    if (createProjectDto.categoryId) {
      category = await this.categoryRepository.findOneBy({
        id: createProjectDto.categoryId,
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createProjectDto.categoryId} not found`,
        );
      }
    }

    const { startDate, endDate, ...rest } = createProjectDto;

    const slug = await this.generateUniqueSlug(createProjectDto.name);

    const project = this.projectRepository.create({
      ...rest,
      slug,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      owner,
      category,
    });

    const savedProject = await this.projectRepository.save(project);

    // Mapper le projet vers le DTO
    return {
      id: savedProject.id,
      name: savedProject.name,
      slug: savedProject.slug,
      description: savedProject.description,
      startDate: project.startDate
        ? dayjs(project.startDate).format("YYYY-MM-DD")
        : null,
      endDate: project.endDate
        ? dayjs(project.endDate).format("YYYY-MM-DD")
        : null,
      owner: {
        id: owner.id,
        firstname: project.owner.firstname,
        lastname: project.owner.lastname,
        slug: project.owner.slug,
        email: owner.email,
      },
      participants: [],
      category: category
        ? {
            id: category.id,
            name: category.name,
          }
        : undefined,
    };
  }

  // Mettre à jour un projet
  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async delete(slug: string): Promise<void> {
    const result = await this.projectRepository.delete({ slug });
    if (result.affected === 0) {
      throw new NotFoundException(`Project with slug "${slug}" not found`);
    }
  }  

  async createFrom(id: number): Promise<ProjectSummaryDto> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ["owner", "participants", "tasks"], // Charger aussi les tâches
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Création du projet dupliqué
    const duplicatedProject = this.projectRepository.create({
      name: `${project.name} (Copy)`,
      description: project.description,
      owner: project.owner,
      participants: project.participants,
    });

    const savedProject = await this.projectRepository.save(duplicatedProject);

    // Copier les tâches du projet original
    const duplicatedTasks = project.tasks.map((task) => {
      return this.taskRepository.create({
        title: task.title,
        description: task.description,
        isCompleted: task.isCompleted,
        project: savedProject, // Associer les tâches au projet dupliqué
      });
    });

    // Sauvegarder les nouvelles tâches
    await this.taskRepository.save(duplicatedTasks);

    // Mapper le projet vers le DTO
    return {
      id: savedProject.id,
      name: savedProject.name,
      slug: savedProject.slug,
      description: savedProject.description,
      startDate: project.startDate
        ? dayjs(project.startDate).format("YYYY-MM-DD")
        : null,
      endDate: project.endDate
        ? dayjs(project.endDate).format("YYYY-MM-DD")
        : null,
      owner: {
        id: savedProject.owner.id,
        firstname: project.owner.firstname,
        lastname: project.owner.lastname,
        slug: project.owner.slug,
        email: savedProject.owner.email,
      },
      participants: savedProject.participants.map((participant) => ({
        id: participant.id,
        firstname: participant.firstname,
        lastname: participant.lastname,
        slug: participant.slug,
        email: participant.email,
      })),
    };
  }

  // Ajouter un utilisateur à un projet
  async addUserToProject(
    projectSlug: string,
    userId: number,
  ): Promise<ProjectSummaryDto> {
    const project = await this.projectRepository.findOne({
      where: { slug: projectSlug },
      relations: ["participants", "owner"],
    });
    if (!project) {
      throw new NotFoundException(`Project with slug "${projectSlug}" not found`);
    }
  
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    if (!project.participants.find((participant) => participant.id === userId)) {
      project.participants.push(user);
      await this.projectRepository.save(project);
    }
  
    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      startDate: project.startDate
        ? dayjs(project.startDate).format("YYYY-MM-DD")
        : null,
      endDate: project.endDate
        ? dayjs(project.endDate).format("YYYY-MM-DD")
        : null,
      owner: {
        id: project.owner.id,
        firstname: project.owner.firstname,
        lastname: project.owner.lastname,
        slug: project.owner.slug,
        email: project.owner.email,
      },
      participants: project.participants.map((participant) => ({
        id: participant.id,
        firstname: participant.firstname,
        lastname: participant.lastname,
        slug: participant.slug,
        email: participant.email,
      })),
    };
  }  

  async findProjectsByOwner(
    ownerId: number,
    page: number,
    limit: number,
  ): Promise<PaginationResult<ProjectSummaryDto>> {
    const [projects, total] = await this.projectRepository.findAndCount({
      where: { owner: { id: ownerId } },
      relations: ["owner", "participants", "category"],
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedProjects = projects.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      startDate: project.startDate
        ? dayjs(project.startDate).format("YYYY-MM-DD")
        : null,
      endDate: project.endDate
        ? dayjs(project.endDate).format("YYYY-MM-DD")
        : null,
      owner: {
        id: project.owner.id,
        firstname: project.owner.firstname,
        lastname: project.owner.lastname,
        slug: project.owner.slug,
        email: project.owner.email,
      },
      participants: project.participants.map((participant) => ({
        id: participant.id,
        firstname: participant.firstname,
        lastname: participant.lastname,
        slug: participant.slug,
        email: participant.email,
      })),
      category: project.category
        ? {
            id: project.category.id,
            name: project.category.name,
          }
        : null,
    }));

    return applyPagination(formattedProjects, total);
  }

  async findProjectsByParticipant(
    //si user est owner inclu
    userId: number,
    page: number,
    limit: number,
  ): Promise<PaginationResult<ProjectSummaryDto>> {
    const [projects, total] = await this.projectRepository.findAndCount({
      where: [{ owner: { id: userId } }, { participants: { id: userId } }],
      relations: ["owner", "participants", "category"],
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedProjects = projects.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      startDate: project.startDate
        ? dayjs(project.startDate).format("YYYY-MM-DD")
        : null,
      endDate: project.endDate
        ? dayjs(project.endDate).format("YYYY-MM-DD")
        : null,
      owner: {
        id: project.owner.id,
        firstname: project.owner.firstname,
        lastname: project.owner.lastname,
        slug: project.owner.slug,
        email: project.owner.email,
      },
      participants: project.participants.map((participant) => ({
        id: participant.id,
        firstname: participant.firstname,
        lastname: participant.lastname,
        slug: participant.slug,
        email: participant.email,
      })),
      category: project.category
        ? {
            id: project.category.id,
            name: project.category.name,
          }
        : null,
    }));

    return applyPagination(formattedProjects, total);
  }

  async findProjectsByCategory(
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<PaginationResult<ProjectSummaryDto>> {
    const [projects, total] = await this.projectRepository.findAndCount({
      where: { category: { id: categoryId } },
      relations: ["owner", "participants", "category"],
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedProjects = projects.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      startDate: project.startDate
        ? dayjs(project.startDate).format("YYYY-MM-DD")
        : null,
      endDate: project.endDate
        ? dayjs(project.endDate).format("YYYY-MM-DD")
        : null,
      owner: {
        id: project.owner.id,
        firstname: project.owner.firstname,
        lastname: project.owner.lastname,
        slug: project.owner.slug,
        email: project.owner.email,
      },
      participants: project.participants.map((participant) => ({
        id: participant.id,
        firstname: participant.firstname,
        lastname: participant.lastname,
        slug: participant.slug,
        email: participant.email,
      })),
      category: {
        id: project.category.id,
        name: project.category.name,
      },
    }));

    return applyPagination(formattedProjects, total);
  }
}
