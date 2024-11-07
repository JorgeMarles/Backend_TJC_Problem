import express from "express";
import { create, erase, filter, find } from "../controllers/ProblemController";

export const problemRouter = express.Router();

problemRouter.post("/", create);
problemRouter.get("/", find);
problemRouter.get("/filter", filter);
problemRouter.delete("/", erase);
// userRouter.put("/", update);
// //userRouter.get("/all", get_all);
// //userRouter.get("/:id", );
