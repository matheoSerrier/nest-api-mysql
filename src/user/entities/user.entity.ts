import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { Project } from "../../project/entities/project.entity";
import { Task } from "../../task/entities/task.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column({ type: "varchar", length: 50 })
  firstname: string;

  @Column({ type: "varchar", length: 50 })
  lastname: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
    default: "default@example.com",
  })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[];

  @ManyToMany(() => Project, (project) => project.participants)
  participatingProjects: Project[];

  @ManyToMany(() => Task, (task) => task.assignedUsers)
  tasks: Task[];
}
