import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "../config";
import { DataSource } from 'typeorm';
import mysql from "mysql2";
import { User } from "./entity/User";
import { Problem } from "./entity/Problem";
import { Submission } from "./entity/Submission";
import { Topic } from "./entity/Topic";

export const AppDataSource = new DataSource({
  type: 'mysql', 
  driver: mysql, 
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  entities: [User, Problem, Submission, Topic]
});