import express from "express";
import { create } from "../controllers/UserController";
import { authenticate } from "../middleware/authenticateToken";

export const userRouter = express.Router();

userRouter.post("/", authenticate(['service']), create);
// userRouter.delete("/", disable);
// userRouter.put("/", update);
//userRouter.get("/", find);
// //userRouter.get("/all", get_all);
// //userRouter.get("/:id", );
