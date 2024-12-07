import { Request, Response } from "express";
import { createProblem, eraseProblem, findProblems, findProblem} from "../services/ProblemServices";

export const create = async (req: Request, res: Response) => {
    try {
        createProblem(req, res);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

export const erase = async (req: Request, res: Response) => {
    try {
        eraseProblem(req, res);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

export const find = async (req: Request, res: Response) => {
    try {
        if(req.query["id"] !== undefined) {
            findProblem(req, res);
        }
        else {
            findProblems(req, res);
        }
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};
