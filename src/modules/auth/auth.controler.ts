import type { Request, Response } from "express";
// import { authRoute } from "./auth.route";
import { authService } from "./auth.service";


const loginUser = async (req: Request, res: Response) => {
try {

    const result = await authService.loginUserIntoDB(req.body);

console.log(result);
res.status(200).json({
      success: true,
      message: "user login suceccssfuly",
      data: result,
    });

} catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to delete user",
      error: error,
    });
  }

}



export const authControler = {
    loginUser
}
