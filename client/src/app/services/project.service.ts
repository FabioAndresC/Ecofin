import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class ProjectService {
	private supabaseClient: SupabaseClient;

	constructor() {
		this.supabaseClient = createClient(
			environment.supabaseUrl,
			environment.supabaseKey
		);
	}

	async createProject(project: any): Promise<any> {
		const { data, error } = await this.supabaseClient
			.from('projects')
			.insert([project]);

		if (error) {
			console.error('Error creating project:', error);
			throw error;
		}

		return data;
	}

	async getProjects(): Promise<any> {
		const { data, error } = await this.supabaseClient
			.from('projects')
			.select('*');

		if (error) {
			console.error('Error fetching projects:', error);
			throw error;
		}

		return data;
	}

	async getProjectById(projectId: number): Promise<any> {
		const { data, error } = await this.supabaseClient
			.from('projects')
			.select('*')
			.eq('project_id', projectId)
			.single();

		if (error) {
			console.error('Error fetching project:', error);
			throw error;
		}

		return data;
	}

	async getProjectByUserId(userId: string): Promise<any> {
		const { data, error } = await this.supabaseClient
			.from('projects')
			.select('*')
			.eq('user_id', userId);

		if (error) {
			console.error('Error fetching project:', error);
			throw error;
		}

		return data;
	}

	async updateProject(projectId: number, project: any): Promise<any> {
		const { data, error } = await this.supabaseClient
			.from('projects')
			.update(project)
			.eq('project_id', projectId);

		if (error) {
			console.error('Error updating project:', error);
			throw error;
		}

		return data;
	}

	async deleteProject(projectId: number): Promise<any> {
		const { data, error } = await this.supabaseClient
			.from('projects')
			.delete()
			.eq('project_id', projectId);

		if (error) {
			console.error('Error deleting project:', error);
			throw error;
		}

		return data;
	}
}
