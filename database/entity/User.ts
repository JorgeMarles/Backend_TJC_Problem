import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Submission } from "./Submission";

@Entity({ name: "user" })
export class User {
    @PrimaryColumn()
    id: number;

    @OneToMany(() => Submission, submission => submission.user)
    submissions: Submission[];
}
