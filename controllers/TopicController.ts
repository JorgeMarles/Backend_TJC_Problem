import { Request, Response } from "express";
import { createTopic, eraseTopic, findTopics } from "../services/TopicServices";

export const create = async (req: Request, res: Response) => {
    try {
        createTopic(req, res);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

export const erase = async (req: Request, res: Response) => {
    try {
        eraseTopic(req, res);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

export const find = async (req: Request, res: Response) => {
    try {
        findTopics(req, res);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};