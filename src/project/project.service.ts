import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from "./entities/project.entity";
import { User } from "../user/entities/user.entity";
import { Task } from "../task/entities/task.entity";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  // Récupérer tous les projets
  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ["owner", "participants"],
    });
  }

  // Récupérer un projet par son ID avec ses participants
  async getProjectById(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ["owner", "participants"],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const owner = await this.userRepository.findOneBy({
      id: createProjectDto.ownerId,
    });
    if (!owner) {
      throw new NotFoundException(
        `Owner with ID ${createProjectDto.ownerId} not found`,
      );
    }

    const project = this.projectRepository.create({
      ...createProjectDto,
      owner,
    });
    const savedProject = await this.projectRepository.save(project);

    // Ajouter des tâches par défaut au projet
    await this.addDefaultTasks(savedProject);

    return savedProject;
  }

  private async addDefaultTasks(project: Project): Promise<void> {
    const defaultTasks = [
      {
        title: "Planification initiale",
        description: "Définir les objectifs et les délais.",
      },
      {
        title: "Recherche et analyse",
        description: "Analyser les besoins et proposer des solutions.",
      },
      {
        title: "Développement initial",
        description: "Commencer le développement de base.",
      },
      {
        title: "Test et validation",
        description: "Effectuer les tests pour garantir la qualité.",
      },
      { title: "Livraison", description: "Livrer le projet au client." },
    ];

    const tasks = defaultTasks.map((taskData) =>
      this.taskRepository.create({ ...taskData, project }),
    );

    await this.taskRepository.save(tasks);
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

  // Supprimer un projet
  async delete(id: number): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  // Dupliquer un projet
  async createFrom(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ["owner", "participants"],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const duplicatedProject = this.projectRepository.create({
      name: `${project.name} (Copy)`,
      description: project.description,
      owner: project.owner,
      participants: project.participants,
    });

    return this.projectRepository.save(duplicatedProject);
  }

  // Ajouter un utilisateur à un projet
  async addUserToProject(projectId: number, userId: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ["participants"],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (
      !project.participants.find((participant) => participant.id === userId)
    ) {
      project.participants.push(user);
      await this.projectRepository.save(project);
    }

    return project;
  }
}
