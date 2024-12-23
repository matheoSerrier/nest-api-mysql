import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Task } from "../../task/entities/task.entity";

@Entity()
export class Project {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @Column({ type: "varchar", length: 255 })
  description: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.projects)
  owner: User;

  @ManyToMany(() => User, (user) => user.participatingProjects)
  @JoinTable()
  participants: User[];

  @OneToMany(() => Task, (task) => task.project, { cascade: true })
  tasks: Task[];
}
