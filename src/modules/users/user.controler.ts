import type { Request, Response } from "express";

import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body)

    res.status(201).json({
      success: true,
      message: "user created",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to create user",
      error: error,
    });
  }
}

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserFromDB();
    res.status(200).json({
      success: true,
      message: "users retrieved successfully",
      data: result.rows
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to retrieve users",
      error: error,
    });
  }
}

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
   const result = await userService.getSingleUserFromDB(id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "user retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to retrieve user",
      error: error,
    });
  }
}

const getPutUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userService.getPutUserFromDB(req.body, id as string)

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "user updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to update user",
      error: error,
    });
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteFromDB(id as string)

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to delete user",
      error: error,
    });
  }
}

export const userControler = {
    createUser, getAllUsers, getSingleUser, getPutUser, deleteUser
}
