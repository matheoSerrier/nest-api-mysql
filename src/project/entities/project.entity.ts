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
import { Category } from "src/category/entities/category.entity";

@Entity()
export class Project {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @Column({ type: "varchar", length: 255 })
  description: string;

  @Column({ type: "date", default: () => "CURRENT_DATE" }) // Date du jour par défaut
  startDate: Date;

  @Column({ type: "date", nullable: true, default: null }) // NULL par défaut
  endDate: Date | null;

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

  @ManyToOne(() => Category, (category) => category.projects, { nullable: true })
  category: Category | null;
}
