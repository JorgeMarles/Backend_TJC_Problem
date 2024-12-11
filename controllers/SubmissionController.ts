import { Request, Response } from "express";
import { findAllSubmissions, findByTopics, findSubmission } from "../services/SubmissionServices";

export const findOne = async (req: Request, res: Response) => {
    try {
        const submission_id = req.query.submission_id;
        if (!submission_id) {
            res.status(400).json({ message: "The submission_id is required" });
            return;
        }
        if (typeof submission_id !== "string") {
            res.status(400).json({ message: "The submission_id must be a string" });
            return;
        }
        findSubmission(submission_id, res);
    } 
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

export const find = async (req: Request, res: Response) => {
    try {
        const user_id = req.query.user_id;
        const problem_id = req.query.problem_id;
        if (!user_id == undefined && typeof user_id !== "string") {
            res.status(400).json({ message: "The user_id must be a one value" });
            return;
        }
        if (!problem_id == undefined && typeof problem_id !== "string") {
            res.status(400).json({ message: "The problem_id must be a one value" });
            return;
        }
        let parse_user_id: undefined | number = undefined;
        if (user_id !== undefined && typeof user_id === "string") {
            parse_user_id = parseInt(user_id);
        }
        let parse_problem_id: undefined | number = undefined;
        if (problem_id !== undefined && typeof problem_id === "string") {
            parse_problem_id = parseInt(problem_id);
        }
        findAllSubmissions(parse_user_id, parse_problem_id, res);
    } 
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

export const findTopics = async (req: Request, res: Response) => {
    try {
        const user_id = req.query.user_id;
        if (!user_id) {
            res.status(400).json({ message: "The user_id is required" });
            return;
        }
        if (typeof user_id !== "string") {
            res.status(400).json({ message: "The user_id must be a one value" });
            return;
        }
        findByTopics(parseInt(user_id), res);
    } 
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
