import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class DonationService {
	private supabaseClient: SupabaseClient;

	constructor() {
		this.supabaseClient = createClient(
			environment.supabaseUrl,
			environment.supabaseKey
		);
	}

	async createDonation(userId: string, projectId: number, amount: number) {
		const { data, error } = await this.supabaseClient
			.from('donations')
			.insert([{ user_id: userId, project_id: projectId, amount }]);

		if (error) {
			throw error;
		}

		return data;
	}

	async getDonationsByUser(userId: string) {
		const { data, error } = await this.supabaseClient
			.from('donations')
			.select('*')
			.eq('user_id', userId);

		if (error) {
			throw error;
		}

		return data;
	}

	async getDonationsByProject(projectId: number) {
		const { data, error } = await this.supabaseClient
			.from('donations')
			.select('*')
			.eq('project_id', projectId);

		if (error) {
			throw error;
		}

		return data;
	}
}
