import { NextFunction, Request, Response } from "express";
import { CreateError } from "./error";
import Jwt from "jsonwebtoken";

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;
    console.log(token);
    if (!token) {
        return next(CreateError(401, "You are not authenticated"));
    }
    Jwt.verify(token, process.env.JWT_SECRET || "", (err: any, user: any) => {
        if (err) {
            return next(CreateError(403, "Token is not valid"));
        } else {
            req.user = user;
        }
        next();
    });
};

export const verifyUser = (req: any, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        if (req.user?._id === req.params.id || req.user?.isAdmin) {
            return next();
        } else {
            return next(CreateError(403, "You are not allowed to do that, sad"));
        }
    });
};

export const verifyAdmin = (req: any, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        if (req.user?.isAdmin) {
            next();
        } else {
            return next(CreateError(403, "You are not allowed to do that"));
        }
    });
};
