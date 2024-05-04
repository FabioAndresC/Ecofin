import { NextFunction, Request, Response } from "express";
import Role from "../models/Role";
import { CreateError } from "../utils/error";
import { CreateSuccess } from "../utils/success";

export const createRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.body.role && req.body.role !== "") {
            const newRole = new Role(req.body);
            await newRole.save();
            return res.send("Role created");
        } else {
            return next(CreateError(400, "Role is required"));
        }
    } catch (error) {
        return next(CreateError(500, "Internal server error"));
    }
};

export const updateRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const role = await Role.findById({ _id: req.params.id });
        if (role) {
            const newData = await Role.findByIdAndUpdate(
                {
                    _id: req.params.id,
                },
                { $set: req.body },
                { new: true }
            );

            return next(CreateSuccess(200, "Role updated", newData));
        } else {
            return next(CreateError(404, "Role not found"));
        }
    } catch (error) {
        return next(CreateError(500, "Internal server error"));
    }
};

export const deleteRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const role = await Role.findById({ _id: req.params.id });
        if (role) {
            await Role.findByIdAndDelete({ _id: req.params.id });
            return next(CreateSuccess(200, "Role deleted"));
        } else {
            return next(CreateError(404, "Role not found"));
        }
    } catch (error) {
        return next(CreateError(500, "Internal server error"));
    }
};

export const getAllRoles = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const roles = await Role.find();
        return next(CreateSuccess(200, "Roles found", roles));
    } catch (error) {
        return next(CreateError(500, "Internal server error"));
    }
};
