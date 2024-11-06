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
        const problems: Problem[] = await ProblemRepository.find({relations: {
            topic: true
        }}); 
        return res.status(200).send({ problems: problems});
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


// export const disableUser = async (req: Request, res: Response) => {
//     try {        
//         const email: string = req.body["email"];
//         const user: unknown = await UserRepository.findOneBy({ email: email });
//         if (user instanceof User) {
//             UserRepository.delete(user.id);
//             return res.status(200).send({ isErased: true, message: "User disabled succesfully" });
//         }
//         else throw Error("The user don't exists");
//     }
//     catch (error: unknown) {
//         console.log(error);
//         if (error instanceof Error) {
//             return res.status(400).send({ isErased: false, message: error.message });
//         }
//         else {
//             return res.status(400).send({ isErased: false, message: "Something went wrong"});
//         }
//     }
// };

// const removeUndefined = <T extends User>(user: T, userUpdate: T) => {
//     for (let key in user) {
//         if (userUpdate[key] == undefined) {
//             userUpdate[key] = user[key];
//         }
//     }
// };

// export const updateUser = async (req: Request, res: Response) => {
//     try {        
//         const userUpdate: User = req.body;
//         const user: unknown = await UserRepository.findOneBy({ email: userUpdate.email }); 
//         if (user instanceof User) {
//             removeUndefined(user, userUpdate);
//             UserRepository.update(user.id, userUpdate);
//             return res.status(200).send({ isUpdate: true, user: userUpdate, message: "User updated succesfully" });
//         }
//         else throw Error("The user don't exists");
//     }
//     catch (error: unknown) {
//         console.log(error);
//         if (error instanceof Error) {
//             return res.status(400).send({ isUpdate: false, message: error.message });
//         }
//         else {
//             return res.status(400).send({ isUpdate: false, message: "Something went wrong"});
//         }
//     }
// };

// export const findUser = async (req: Request, res: Response) => {
//     try {        
//         const email: unknown  = req.query.email;
//         if (typeof email == "string") {
//             const user: unknown = await UserRepository.findOneBy({ email: email }); 
//             if (user instanceof User) {
//                 return res.status(200).send({ user: user});
//             }
//             else throw Error("The user don't exists");
//         }
//         else throw Error("Invalid data");
//     }
//     catch (error: unknown) {
//         console.log(error);
//         if (error instanceof Error) {
//             return res.status(400).send({ message: error.message });
//         }
//         else {
//             return res.status(400).send({ message: "Something went wrong"});
//         }
//     }
// };

// export const findUsers = async (req: Request, res: Response) => {
//     try {        
//         const users: User[] = await UserRepository.find(); 
//         return res.status(200).send({ users: users});
//     }
//     catch (error: unknown) {
//         console.log(error);
//         if (error instanceof Error) {
//             return res.status(400).send({ message: error.message });
//         }
//         else {
//             return res.status(400).send({ message: "Something went wrong"});
//         }
//     }
// };
