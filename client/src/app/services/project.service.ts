import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ProjectService {
	private supabaseClient: SupabaseClient;

	constructor() {
		if (environment.supabaseUrl && environment.supabaseKey) {
			this.supabaseClient = createClient(
				environment.supabaseUrl,
				environment.supabaseKey
			);
		} else {
			throw new Error('Supabase URL or key is undefined.');
		}
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

	async uploadProjectImage(file: File): Promise<string> {
		const fileName = `${Date.now()}_${file.name}`;
		const { error } = await this.supabaseClient.storage
			.from('project-images')
			.upload(fileName, file);

		if (error) {
			console.error('Error uploading image:', error);
			throw error;
		}

		const { data } = this.supabaseClient.storage
			.from('project-images')
			.getPublicUrl(fileName);

		if (!data) {
			console.error('Error getting public URL:');
			throw new Error('Error getting public URL');
		}

		return data.publicUrl;
	}

	async uploadDocument(file: File) {
		const fileName = `${Date.now()}/${file.name}`;
		const { error } = await this.supabaseClient.storage
			.from('project-documents')
			.upload(fileName, file);

		if (error) {
			throw error;
		}

		const { data } = this.supabaseClient.storage
			.from('project-documents')
			.getPublicUrl(fileName);

		return data.publicUrl;
	}

	async updateProjectDocumentUrl(projectId: number, documentUrl: string) {
		const { data, error } = await this.supabaseClient
			.from('projects')
			.update({ project_documents: documentUrl })
			.eq('project_id', projectId);

		if (error) {
			throw error;
		}

		return data;
	}

	async updateAmountRaised(projectId: number, amount: number): Promise<any> {
		const { data, error } = await this.supabaseClient.rpc(
			'increment_amount_raised',
			{
				p_project_id: projectId,
				p_amount: amount,
			}
		);

		if (error) {
			console.error('Error updating amount raised:', error);
			throw error;
		}

		return data;
	}
}
