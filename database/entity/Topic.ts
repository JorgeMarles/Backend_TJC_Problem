import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Problem } from "./Problem";

@Entity({ name: "topic" })
export class Topic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 200 })
    name: string;

    @Column("varchar", { length: 400 })
    description: string;
    
    @OneToMany(() => Problem, (problem) => problem.topic)
    problems: Problem[]
}