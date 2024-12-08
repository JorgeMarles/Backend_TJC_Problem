import express from "express";
import { create, erase, find, update } from "../controllers/ProblemController";
import { authenticate } from "../middleware/authenticateToken";

export const problemRouter = express.Router();

problemRouter.post("/", authenticate(['admin']), create);
problemRouter.get("/", authenticate(['admin', 'user']), find);
problemRouter.delete("/", authenticate(['admin']), erase);
problemRouter.put("/", authenticate(['admin']), update);
