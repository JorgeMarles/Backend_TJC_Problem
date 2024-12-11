import express from "express";
import { find, findOne } from "../controllers/SubmissionController";
import { authenticate } from "../middleware/authenticateToken";

export const submissionRouter = express.Router();

submissionRouter.get("/findOne", authenticate(['admin', 'user']), findOne);
submissionRouter.get("/", authenticate(['admin']), find);
