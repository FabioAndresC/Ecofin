import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { CreateError } from "../utils/error";
import { CreateSuccess } from "../utils/success";

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await User.find();
        return next(CreateSuccess(200, "Users found", users));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
};

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(CreateError(404, "User not found"));
        }
        return next(CreateSuccess(200, "User found", user));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
};
