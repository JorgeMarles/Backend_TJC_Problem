import { Request, Response } from "express"
import { ProblemRepository } from "../repositories/ProblemRepository";
import { Problem } from "../database/entity/Problem";
import { TopicRepository } from "../repositories/TopicRepository";
import { Topic } from "../database/entity/Topic";

/**
    {
    "name": "Watermelon",
    "statement": "Cut the watermelon",
    "difficulty": "easy",
    "topicId": 4,
    "example_input": "",
    "example_output": "",
    "url_input": "",
    "url_output": "",
    "url_solution": ""
    }
 */

export const createProblem = async (req: Request, res: Response) => {
    try {        
        const problem : Problem = req.body;
        const topicId : number = req.body.topic_id;
        const topic : unknown = await TopicRepository.findOneBy({id: topicId});
        if (topic instanceof Topic) {
            problem.disable = false;
            problem.topic = topic;
            await ProblemRepository.insert(problem);
            return res.status(201).send({ isCreated: true, message: "Problem created succesfully" });
        }
        else {
            return res.status(400).send({ isCreated: false, message: "The topic don't exist"});
        }
    }
    catch (error: unknown) {
        console.log(error)
        if (error instanceof Error) {
            return res.status(400).send({ isCreated: false, message: error.message });
        }
        else {
            return res.status(400).send({ isCreated: false, message: "Something went wrong"});
        }
    }
};

export const eraseProblem = async (req: Request, res: Response) => {
    try {        
        const id: number = req.body;
        const problem: unknown = await ProblemRepository.findOneBy({ id: id });
        if (problem instanceof Problem) {
            ProblemRepository.delete(id);
            return res.status(200).send({ isErased: true, message: "Problem erased succesfully" });
        }
        else throw Error("The problem don't exists");
    }
    catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(400).send({ isErased: false, message: error.message });
        }
        else {
            return res.status(400).send({ isErased: false, message: "Something went wrong"});
        }
    }
};

export const findProblems = async (req: Request, res: Response) => {
    try {        
        const difficulty = "difficulty" in req.query && typeof req.query["difficulty"] === "string" ? req.query["difficulty"] : undefined;
        const topicName = "topic_name" in req.query && typeof req.query["topic_name"] === "string" ? req.query["topic_name"] : undefined;
        const problems: Problem[] = await ProblemRepository.find({
            relations: {
                topic: true
            },
            where: {
                difficulty: difficulty,
                topic: {
                    name: topicName
                }
            }
        }); 
        return res.status(200).send({ problems: problems });
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(400).send({ message: error.message });
        }
        else {
            return res.status(400).send({ message: "Something went wrong"});
        }
    }
};
