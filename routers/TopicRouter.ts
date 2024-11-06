import express from "express";
import { create, erase, find } from "../controllers/TopicController";

export const topicRouter = express.Router();

topicRouter.post("/", create);
topicRouter.delete("/", erase);
topicRouter.get("/", find);
