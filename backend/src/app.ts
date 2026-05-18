import express from "express";
import routes from "./routes";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware";
import { sanitizeMiddleware } from "./middlewares/sanitize.middleware";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();

app.use(loggerMiddleware);

app.use(rateLimitMiddleware);

app.use(sanitizeMiddleware);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api", routes);

app.use(notFoundMiddleware);

app.use(errorHandler);

export default app;