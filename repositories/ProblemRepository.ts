import { AppDataSource } from "../database";
import { Problem } from "../database/entity/Problem";

export const ProblemRepository = AppDataSource.getRepository(Problem).extend({
    async findBySearch  (query: string): Promise<Problem[]> {
        return this.createQueryBuilder("problem")
            .where("LOWER(problem.name) LIKE :query", { query: `%${query}%` })
            .andWhere("problem.disable = false") // Filtra por problemas habilitados
            .leftJoinAndSelect("problem.topic", "topic")
            .getMany(); // Devuelve los resultados como objetos planos
    }
});