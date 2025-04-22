import express from "express";
import { find, findOne, findTopics } from "../controllers/SubmissionController";
import { authenticate } from "../middleware/authenticateToken";

export const submissionRouter = express.Router();

submissionRouter.get("/findOne", authenticate(['admin', 'user', 'service']), findOne);
submissionRouter.get("/", authenticate(['admin', 'user']), find);
submissionRouter.get("/topics", authenticate(['admin', 'user']), findTopics);
