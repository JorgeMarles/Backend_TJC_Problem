import express from 'express';
import "reflect-metadata";
import { PORT, URL_FRONTEND} from './config';
import { AppDataSource } from './database';
import bodyParser from 'body-parser';
import cors from 'cors';
import { topicRouter } from './routers/TopicRouter';
import { problemRouter } from './routers/ProblemRouter';
import { userRouter } from './routers/UserRouter';
import { submissionRouter } from './routers/SubmissionRouter';

const app = express();

app.use(cors({
    origin: URL_FRONTEND
}));

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log("Middleware");
    next();
});

app.use("/topic", topicRouter);
app.use("/problem", problemRouter);
app.use("/user", userRouter);
app.use("/submission", submissionRouter);

const run = async () => {
    try {
        await AppDataSource.initialize();
    }
    catch (e: unknown) {
        if (e instanceof Error) {
            console.log(e.message);
        }
        else console.log("Error during Data Source initialization");
    }
    app.listen(PORT, () => console.log(`Listening in port ${PORT}`));
};

run();