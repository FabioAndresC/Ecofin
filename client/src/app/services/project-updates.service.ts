import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class ProjectUpdateService {
	private supabase: SupabaseClient;

	constructor() {
		this.supabase = createClient(
			environment.supabaseUrl,
			environment.supabaseKey
		);
	}

	// Obtener todas las actualizaciones de un proyecto
	async getUpdatesByProject(projectId: number) {
		const { data, error } = await this.supabase
			.from('project_updates')
			.select('*')
			.eq('project_id', projectId);

		if (error) {
			throw error;
		}

		return data;
	}

	// Crear una nueva actualización
	async createUpdate(
		projectId: number,
		creatorId: string,
		title: string,
		description: string
	) {
		const { data, error } = await this.supabase
			.from('project_updates')
			.insert([
				{
					project_id: projectId,
					creator_id: creatorId,
					title: title,
					description: description,
				},
			]);

		if (error) {
			throw error;
		}

		return data;
	}

	// Actualizar una actualización existente
	async updateUpdate(updateId: number, title: string, description: string) {
		const { data, error } = await this.supabase
			.from('project_updates')
			.update({
				title: title,
				description: description,
				updated_at: new Date(),
			})
			.eq('update_id', updateId);

		if (error) {
			throw error;
		}

		return data;
	}

	// Eliminar una actualización
	async deleteUpdate(updateId: number) {
		const { data, error } = await this.supabase
			.from('project_updates')
			.delete()
			.eq('update_id', updateId);

		if (error) {
			throw error;
		}

		return data;
	}
}
