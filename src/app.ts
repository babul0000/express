import express, { type Application, type Request, type Response } from "express";
import { userRoute } from "./modules/users/users.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "this is route route",
    author: "programing hero",
  });
});
app.use("/api/v1/users", userRoute);
app.use("/api/v1/profile", profileRoute)
app.use("/api/v1/auth", authRoute)

export default app
