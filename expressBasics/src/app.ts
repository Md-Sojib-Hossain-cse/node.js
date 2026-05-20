import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { userRoutes } from "./modules/user/user.routes";
import { profileRoutes } from "./modules/profile/profile.route";
import { authRoutes } from "./modules/auth/auth.route";
import logger from "./middleware/logger";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

//middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello world!",
  });
});

app.use("/api/users", userRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/auth", authRoutes);

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
