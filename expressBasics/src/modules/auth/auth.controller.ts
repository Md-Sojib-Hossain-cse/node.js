import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserFromDB(req.body);

    const { refreshToken } = result;

    res
      .cookie("refreshToken", refreshToken, {
        secure: false, // in production true
        httpOnly: true,
        sameSite: "lax",
      })
      .status(200)
      .json({
        success: true,
        message: "User logged in Successfully!",
        data: result || [],
      });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error",
      data: error,
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.generateRefreshToken(
      req?.cookies?.refreshToken,
    );

    res.status(200).json({
      success: true,
      message: "Access token generated Successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error",
      data: error,
    });
  }
};

export const authController = {
  loginUser,
  refreshToken,
};
