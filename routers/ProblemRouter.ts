import express from "express";
import { create, erase, find, runCode, update, uploadTest } from "../controllers/ProblemController";
import { authenticate } from "../middleware/authenticateToken";
import multer from "multer";
import { codeUploader, testCasesUploader } from "../middleware/UploaderMiddleware";

export const problemRouter = express.Router();

problemRouter.post("/run", authenticate(['admin', 'user']), codeUploader.single('code'), runCode);
problemRouter.post("/uploadTests", authenticate(['admin']), testCasesUploader.fields([{ name: "inputs", maxCount: 1 }, { name: "outputs", maxCount: 1 }]), uploadTest);
problemRouter.post("/", authenticate(['admin']), create);
problemRouter.get("/", authenticate(['admin', 'user']), find);
problemRouter.delete("/", authenticate(['admin']), erase);
problemRouter.put("/", authenticate(['admin']), update);

problemRouter.use((error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).send({ message: `Multer error: ${error.message}` });
    }
    if (error instanceof Error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).send({ message: 'An unknown error occurred' });
});