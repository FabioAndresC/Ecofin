import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import roleRoute from "./routes/role";
import authRoute from "./routes/auth";
import userRoute from "./routes/user";
const app = express();
dotenv.config();

// Routes
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:4200",
		credentials: true,
	})
);
app.use("/api/role", roleRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

// Response handling Middleware
app.use((obj: any, req: any, res: any, next: any) => {
	const statusCode = obj.status || 500;
	const message = obj.message || "Internal Server Error";
	return res.status(statusCode).json({
		success: [200, 201, 204].some((el) => el === statusCode) ? true : false,
		status: statusCode,
		message: message,
		data: obj.data,
	});
});

// DB Connection
const connectMongoDb = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URL || "");
		console.log("MongoDB Connected");
	} catch (error) {
		throw error;
	}
};

// Start server
app.listen(8800, () => {
	connectMongoDb();
	console.log("Server started on port 8800");
});
