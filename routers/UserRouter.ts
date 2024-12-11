import express from "express";
import { create, find } from "../controllers/UserController";

export const userRouter = express.Router();

userRouter.post("/", create);
// userRouter.delete("/", disable);
// userRouter.put("/", update);
userRouter.get("/", find);
// //userRouter.get("/all", get_all);
// //userRouter.get("/:id", );
