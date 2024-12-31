import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { Project } from "src/project/entities/project.entity"
  
  @Entity()
  export class Category {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "varchar", length: 100, unique: true })
    name: string;
  
    @OneToMany(() => Project, (project) => project.category)
    projects: Project[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  