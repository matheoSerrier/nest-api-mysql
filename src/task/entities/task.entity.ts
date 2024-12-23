import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Project } from "../../project/entities/project.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "boolean", default: false })
  isCompleted: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  // Relation obligatoire avec un projet
  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: "CASCADE",
    nullable: false,
  })
  project: Project;

  // Relation optionnelle avec des utilisateurs
  @ManyToMany(() => User, (user) => user.tasks)
  @JoinTable()
  assignedUsers: User[];
}
