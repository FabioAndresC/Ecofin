import { NextFunction, Request, Response } from "express";
import Role from "../models/Role";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { CreateError } from "../utils/error";
import { CreateSuccess } from "../utils/success";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const role = await Role.find({ role: "user" });
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.userName,
        email: req.body.email,
        password: hashedPassword,
        roles: role,
    });
    await newUser.save();
    return next(CreateSuccess(200, "User created successfully"));
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ email: req.body.email }).populate(
            "roles",
            "role"
        );
        const roles = user?.roles.map((role: any) => role.role);

        if (!user) {
            return res.status(404).send("User not found");
        }
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            return next(CreateError(400, "Wrong password"));
        }

        // Before returning the success response, we need to generate a token and send it via cookies
        const token = jwt.sign(
            {
                _id: user._id,
                isAdmin: user.isAdmin,
                roles: roles,
            },
            process.env.JWT_SECRET || ""
        );
        res.cookie("access_token", token, {
            httpOnly: true,
        })
            .status(200)
            .json({
                status: 200,
                message: "Logged in successfully",
                data: user,
            });

        // return next(CreateSuccess(200, "Logged in succesfully"));
    } catch (error) {
        return next(CreateError(500, "Internal server error"));
    }
};

export const registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const role = await Role.find();
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.userName,
        email: req.body.email,
        password: hashedPassword,
        roles: role,
        isAdmin: true,
    });
    await newUser.save();
    return next(CreateSuccess(200, "Admin created successfully"));
};
