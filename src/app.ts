import express, { type Application, type Request, type Response } from "express";
import { userRoute } from "./modules/users/users.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import logger from "./middleware/logger";
import globalErrorHandaler from "./middleware/globalErrorHandaler";
import cors from "cors"
import cookieParser from "cookie-parser";

const app: Application = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger)

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "this is root route",
    author: "programing hero",
  });
});
app.use("/api/v1/users", userRoute);
app.use("/api/v1/profile", profileRoute)
app.use("/api/v1/auth", authRoute)


// Global Error Handling Middleware
app.use(globalErrorHandaler);

export default app
