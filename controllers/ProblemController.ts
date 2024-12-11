import { Request, Response } from "express";
import { createProblem, eraseProblem, findProblems, findProblem, updateProblem, saveTestCases, run} from "../services/ProblemServices";

export const runCode = async (req: Request, res: Response) => {
    try {
        const user_id = req.body.user_id;
        if (!user_id) {
            res.status(400).json({ message: "The user_id is required" });
            return;
        }
        const problem_id = req.body.problem_id;
        if (!problem_id) {
            res.status(400).json({ message: "The problem_id is required" });
            return;
        }
        const code = req.file;
        if (!code) {
            res.status(400).json({ message: "The code file is required" });
            return;
        }
        run(user_id, problem_id, code, res);
    } 
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

export const uploadTest = async (req: Request, res: Response) => {
    try {
        const problem_id = req.body.problem_id;
        if (!problem_id) {
            res.status(400).json({ message: "The problem_id is required" });
            return;
        }
        let inputsFile = undefined;
        if (req.files != undefined && "inputs" in req.files) {
            inputsFile = req.files["inputs"]?.[0];
        }
        let outputsFile = undefined;
        if (req.files != undefined && "outputs" in req.files) {
            outputsFile = req.files["outputs"]?.[0];
        }
        if (!inputsFile || !outputsFile) {
            res.status(400).json({ message: "The inputs or outputs files don't exits in the request" });
            return;
        }
        saveTestCases(problem_id, inputsFile, outputsFile, res);
    }
    catch (error: unknown) {
        console.log(error)
        if (error instanceof Error) {
            res.status(400).send({ isUploaded: false, message: error.message });
        }
        else {
            res.status(400).send({ isUploaded: false, message: "Something went wrong" });
        }
    }
}

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

export const update = async (req: Request, res : Response) => {
    try {
        updateProblem(req, res);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};