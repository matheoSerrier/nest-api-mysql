import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Project } from "../../project/entities/project.entity";
import { User } from "../../user/entities/user.entity";
import { Tag } from "../../tag/entities/tag.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @Column({ type: "varchar", length: 100, unique: true })
  slug: string;

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

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: "CASCADE",
    nullable: false,
  })
  project: Project;

  @ManyToMany(() => User, (user) => user.tasks)
  @JoinTable()
  assignedUsers: User[];

  @ManyToMany(() => Tag, (tag) => tag.tasks, { cascade: true })
  @JoinTable()
  tags: Tag[];
}
