import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Submission } from "./Submission";
import { Topic } from "./Topic";

@Entity({ name: "problem" })
export class Problem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 800 })
    enunciado: string;

    @Column("varchar", { length: 100 })
    example_input: string;

    @Column("varchar", { length: 100 })
    example_output: string;

    @Column("varchar", { length: 200 })
    url_input: string;

    @Column("varchar", { length: 200 })
    url_output: string;

    @Column("varchar", { length: 200 })
    url_solution: string;

    @Column("boolean")
    disable: boolean;

    @OneToMany(() => Submission, submission => submission.problem)
    submissions: Submission[];

    @ManyToOne(() => Topic, (topic) => topic.problems)
    topic: Topic
}