import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Submission } from "./Submission";

@Entity({ name: "users" })
export class User {
    @PrimaryColumn()
    id: number;

    @OneToMany(() => Submission, submission => submission.user)
    submissions: Submission[];
}
