import type { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "created!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error",
      data: error,
    });
  }
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserFromDB();
    res.status(200).json({
      success: true,
      message: "Users retrieve Successfully!",
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

const getSpecificUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getSpecificUserFromDB(id as string);
    if (!result.rows.length) {
      res.status(404).json({
        success: false,
        message: "User not found!",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieve Successfully!",
      data: result.rows || [],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error",
      data: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userService.updateUserOnDB(id as string, req.body);

    if (!result.rows.length) {
      res.status(404).json({
        success: false,
        message: "User Not Found!",
        data: result.rows[0] || {},
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated Successfully!",
      data: result.rows[0] || {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error",
      data: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userService.deleteUserFromDB(id as string);

    if (!result.rowCount) {
      res.status(404).json({
        success: false,
        message: "User Not Found!",
        data: result.rows[0] || {},
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted Successfully!",
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error",
      data: error,
    });
  }
};

export const userController = {
  createUser,
  getAllUser,
  getSpecificUser,
  updateUser,
  deleteUser,
};
