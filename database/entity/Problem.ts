import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Submission } from "./Submission";
import { Topic } from "./Topic";

@Entity({ name: "problem" })
export class Problem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 100})
    name: string;

    @Column("varchar", { length: 800 })
    statement: string;
    
    @Column("varchar", { length: 800 })
    input: string;
    
    @Column("varchar", { length: 800 })
    output: string;

    @Column("varchar", { length: 20 })
    difficulty : string;

    @Column("varchar", { length: 100 })
    example_input: string;

    @Column("varchar", { length: 100 })
    example_output: string;

    // @Column()
    // timeout: number;

    // @Column()
    // memorylimit: number;

    @Column("boolean")
    disable: boolean;

    @OneToMany(() => Submission, submission => submission.problem)
    submissions: Submission[];

    @ManyToOne(() => Topic, (topic) => topic.problems)
    topic: Topic
}