import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { pool } from "./db";
import { userRoutes } from "./modules/user/user.routes";
import { profileRoutes } from "./modules/profile/profile.route";

const app: Application = express();

//middleware

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello world!",
  });
});

app.use("/api/users", userRoutes);

app.use("/api/profile", profileRoutes);

export default app;
