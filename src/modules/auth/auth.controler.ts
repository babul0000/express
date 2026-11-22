import type { Request, Response } from "express";
// import { authRoute } from "./auth.route";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";


const loginUser = async (req: Request, res: Response) => {
try {

    const result = await authService.loginUserIntoDB(req.body);
const {refreshToken} = result;
res.cookie("refreshToken", refreshToken, {
    secure : false,
    httpOnly : true,
    sameSite : "lax",
    // maxAge :
    path : "/",
    domain : "localhost",
})


sendResponse(res,{
    statusCode: 200,
    success: true,
      message: "user login suceccssfuly",
      data: result,
} );


} catch (error: any) {
    sendResponse(res,{
    statusCode: 500,
    success: false,
      message: error?.message || "Failed to delete user",
      error: error,
} );
  }

}

const genaretToken = async (req: Request, res: Response) => {
try {

    // console.log(req.cookies.refreshToken);

    const result = await authService.genaretAccessToken(req.cookies.refreshToken);

res.status(200).json({
      success: true,
      message: "acces token genareted",
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
    loginUser, genaretToken
}
