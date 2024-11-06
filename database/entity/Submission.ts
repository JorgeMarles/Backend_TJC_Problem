import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Problem } from "./Problem";
import { User } from "./User";

@Entity({ name: "submission" })
export class Submission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 200 })
    url_file: string;

    @Column("varchar", { length: 100 })
    veredict: string;

    @Column("datetime")
    time_judge: Date;

    @Column("datetime")
    time_running: Date;

    @ManyToOne(() => Problem, (problem) => problem.submissions)
    problem: Problem

    @ManyToOne(() => User, (user) => user.submissions)
    user: User

}