import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ProjectReportService {
	private supabase: SupabaseClient;

	constructor() {
		if (environment.supabaseUrl && environment.supabaseKey) {
			this.supabase = createClient(
				environment.supabaseUrl,
				environment.supabaseKey
			);
		} else {
			throw new Error('Supabase URL or key is undefined.');
		}
	}

	// Obtener todos los reportes de un proyecto
	async getReportsByProject(projectId: number) {
		const { data, error } = await this.supabase
			.from('project_reports')
			.select('*')
			.eq('proyecto_id', projectId);

		if (error) {
			throw error;
		}

		return data;
	}

	// Obtener reportes por usuario
	async getReportsByUser(userId: string) {
		const { data, error } = await this.supabase
			.from('project_reports')
			.select('*')
			.eq('user_id', userId);

		if (error) {
			throw error;
		}

		return data;
	}

	// Crear un nuevo reporte
	async createReport(projectId: number, userId: string, motivo: string) {
		const { data, error } = await this.supabase
			.from('project_reports')
			.insert([
				{
					proyecto_id: projectId,
					user_id: userId,
					motivo: motivo,
				},
			]);

		if (error) {
			throw error;
		}

		return data;
	}

	// Actualizar un reporte existente
	async updateReport(reportId: number, motivo: string) {
		const { data, error } = await this.supabase
			.from('project_reports')
			.update({
				motivo: motivo,
				updated_at: new Date(),
			})
			.eq('id', reportId);

		if (error) {
			throw error;
		}

		return data;
	}

	// Eliminar un reporte
	async deleteReport(reportId: number) {
		const { data, error } = await this.supabase
			.from('project_reports')
			.delete()
			.eq('id', reportId);

		if (error) {
			throw error;
		}

		return data;
	}
}
