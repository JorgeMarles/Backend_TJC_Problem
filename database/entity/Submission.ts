import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Problem } from "./Problem";
import { User } from "./User";

@Entity({ name: "submission" })
export class Submission {
    @PrimaryColumn("varchar", { length: 256 })
    id: string | undefined;

    @Column("varchar", { length: 100 })
    veredict: string;

    @Column("varchar", { length: 1000 })
    output: string;

    @Column("datetime")
    time_judge: Date;

    @Column()
    time_running: number;

    @ManyToOne(() => Problem, (problem) => problem.submissions)
    problem: Problem

    @ManyToOne(() => User, (user) => user.submissions)
    user: User
}