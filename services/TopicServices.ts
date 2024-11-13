import { Request, Response } from "express"
import { Topic } from "../database/entity/Topic";
import { TopicRepository } from "../repositories/TopicRepository";

export const createTopic = async (req: Request, res: Response) => {
    try {        
        const topic : Topic = req.body;
        await TopicRepository.insert(topic);
        return res.status(201).send({ isCreated: true, message: "Topic created succesfully" });
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

export const eraseTopic = async (req: Request, res: Response) => {
    try {        
        const id: number = req.body.id;
        const topic: unknown = await TopicRepository.findOne({
            where: {
                id: id
            }
        });
        if (topic instanceof Topic) {
            TopicRepository.delete(id);
            return res.status(200).send({ isErased: true, message: "Topic erased succesfully" });
        }
        else throw Error("The topic don't exists");
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

export const findTopics = async (req: Request, res: Response) => {
    try {        
        const topics: Topic[] = await TopicRepository.find(); 
        return res.status(200).send({ topics: topics});
    }
    catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(400).send({ message: error.message });
        }
        else {
            return res.status(400).send({ message: "Something went wrong"});
        }
    }
};