import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class ProjectActivityService {
	private supabase: SupabaseClient;

	constructor() {
		this.supabase = createClient(
			environment.supabaseUrl,
			environment.supabaseKey
		);
	}

	// Obtener todas las actividades de un proyecto
	async getActivitiesByProject(projectId: number) {
		const { data, error } = await this.supabase
			.from('project_activities')
			.select('*')
			.eq('project_id', projectId);

		if (error) {
			throw error;
		}

		return data;
	}

	// Obtener actividades por usuario
	async getActivitiesByUser(userId: string) {
		const { data, error } = await this.supabase
			.from('project_activities')
			.select('*')
			.eq('user_id', userId);

		if (error) {
			throw error;
		}

		return data;
	}

	// Crear una nueva actividad
	async createActivity(
		projectId: number,
		userId: string,
		fullName: string,
		amountSpent: number,
		description: string
	) {
		const { data, error } = await this.supabase
			.from('project_activities')
			.insert([
				{
					project_id: projectId,
					user_id: userId,
					full_name: fullName,
					amount_spent: amountSpent,
					description: description,
				},
			]);

		if (error) {
			throw error;
		}

		return data;
	}

	// Actualizar una actividad existente
	async updateActivity(
		activityId: number,
		fullName: string,
		amountSpent: number,
		description: string
	) {
		const { data, error } = await this.supabase
			.from('project_activities')
			.update({
				full_name: fullName,
				amount_spent: amountSpent,
				description: description,
				updated_at: new Date(),
			})
			.eq('id', activityId);

		if (error) {
			throw error;
		}

		return data;
	}

	// Eliminar una actividad
	async deleteActivity(activityId: number) {
		const { data, error } = await this.supabase
			.from('project_activities')
			.delete()
			.eq('id', activityId);

		if (error) {
			throw error;
		}

		return data;
	}
}
