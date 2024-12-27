import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Task } from "../../task/entities/task.entity";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @ManyToMany(() => Task, (task) => task.tags)
  tasks: Task[];
}
