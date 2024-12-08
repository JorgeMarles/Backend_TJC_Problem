import express from "express";
import { create, erase, find, update } from "../controllers/ProblemController";

export const problemRouter = express.Router();

problemRouter.post("/", create);
problemRouter.get("/", find);
problemRouter.delete("/", erase);
problemRouter.put("/", update);
