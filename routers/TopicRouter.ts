import express from "express";
import { create, erase, find } from "../controllers/TopicController";
import { authenticate } from "../middleware/authenticateToken";

export const topicRouter = express.Router();

topicRouter.post("/", authenticate(['admin']), create);
topicRouter.delete("/", authenticate(['admin']), erase);
topicRouter.get("/", authenticate(['admin', 'user']), find);
