// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import roleRoute from "./routes/role";
// import authRoute from "./routes/auth";
// import userRoute from "./routes/user";
// const app = express();
// dotenv.config();

// // Routes
// app.use(express.json());
// app.use(cookieParser());
// app.use(
// 	cors({
// 		origin: "http://localhost:4200",
// 		credentials: true,
// 	})
// );
// app.use("/api/role", roleRoute);
// app.use("/api/auth", authRoute);
// app.use("/api/user", userRoute);

// // Response handling Middleware
// app.use((obj: any, req: any, res: any, next: any) => {
// 	const statusCode = obj.status || 500;
// 	const message = obj.message || "Internal Server Error";
// 	return res.status(statusCode).json({
// 		success: [200, 201, 204].some((el) => el === statusCode) ? true : false,
// 		status: statusCode,
// 		message: message,
// 		data: obj.data,
// 	});
// });

// // DB Connection
// const connectMongoDb = async () => {
// 	try {
// 		await mongoose.connect(process.env.MONGO_URL || "");
// 		console.log("MongoDB Connected");
// 	} catch (error) {
// 		throw error;
// 	}
// };

// // Start server
// app.listen(8800, () => {
// 	connectMongoDb();
// 	console.log("Server started on port 8800");
// });

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = 3000;

// Habilitar CORS para todas las rutas
app.use(cors());

app.get('/scrape', async (req, res) => {
	const url = req.query.url;
	if (!url) {
		return res.status(400).send('URL is required');
	}

	try {
		const response = await axios.get(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				'Accept-Language': 'en-US,en;q=0.9',
			}
		});

		const html = response.data;
		const $ = cheerio.load(html);

		const items = [];
		$('ul.sub-menu li.menu-item-object-page a span').each((_, element) => {
            const text = $(element).text().trim();
            if (text.includes('Objetivo')) {
                items.push(text);
            }
        });

		res.json({ items });
	} catch (error) {
		console.error('Error during scraping:', error);
		res.status(500).send('Error scraping the website');
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

