// chatgpt.service.ts
import { Injectable } from '@angular/core';
import { OpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { environment } from '../../environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class AiService {
	constructor() {}

	getDescriptionPrompt(
		name: string,
		description: string,
		infrastructure_type: string
	): string {
		const prompt = `Given the following project details, generate a detailed budget description Taking into account the Bolivian currency (BOB):
		\n\nProject Name: ${name}
		\nProject Description: ${description}
		\nInfrastructure Type: ${infrastructure_type}
		\n\nJust answer with the budget list, don't explain anything else, and at the end of the budget list, tell me the total budget in BOB. Answer all in Spanish`;
		return prompt;
	}

	getValidationPrompt(
		projectName: string,
		projectDescription: string,
		amountSpent: number,
		activityDesc: string
	): string {
		const prompt = `Given the following project activity, validate if it is related to the project.
		Just answer with an object that has 2 properties, 'value' that it's boolean and 'explanation' that explains why it is false or true. Answer all in Spanish
		\nProject Name: ${projectName}
		\nProject Description: ${projectDescription}
		\nAmount Spent in the Activity: ${activityDesc}
		\nActivity description: ${activityDesc}
		`;

		return prompt;
	}

	async validateActivity(
		projectName: string,
		projectDescription: string,
		amountSpent: number,
		activityDesc: string
	): Promise<string> {
		const model = new ChatGoogleGenerativeAI({
			model: 'gemini-1.0-pro',
			maxOutputTokens: 2048,
			apiKey: environment.geminiApiKey,
		});

		const prompt = this.getValidationPrompt(
			projectName,
			projectDescription,
			amountSpent,
			activityDesc
		);

		// Batch and stream are also supported
		const res: any = await model.invoke(prompt);

		console.log(res);
		return res.content;
	}

	async generateBudgetDescOpenAI(
		name: string,
		description: string,
		infrastructure_type: string
	): Promise<string> {
		const model = new OpenAI({
			model: 'gpt-3.5-turbo-instruct', // Defaults to "gpt-3.5-turbo-instruct" if no model provided.
			temperature: 0.9,
			apiKey: environment.geminiApiKey, // In Node.js defaults to process.env.OPENAI_API_KEY
		});

		const prompt = this.getDescriptionPrompt(
			name,
			description,
			infrastructure_type
		);
		const res: any = await model.invoke(prompt);
		return res;
	}

	async generateBudgetDescGoogle(
		name: string,
		description: string,
		infrastructure_type: string
	): Promise<string> {
		const model = new ChatGoogleGenerativeAI({
			model: 'gemini-1.0-pro',
			maxOutputTokens: 2048,
			apiKey: environment.geminiApiKey,
		});

		const prompt = this.getDescriptionPrompt(
			name,
			description,
			infrastructure_type
		);

		// Batch and stream are also supported
		const res: any = await model.invoke(prompt);

		console.log(res);
		return res.content;
	}
}
