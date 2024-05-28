import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class UpdateCommentService {
	private supabase: SupabaseClient;

	constructor() {
		this.supabase = createClient(
			environment.supabaseUrl,
			environment.supabaseKey
		);
	}

	// Obtener todos los comentarios de una actualización
	async getCommentsByUpdate(updateId: number) {
		const { data, error } = await this.supabase
			.from('update_comments')
			.select('*')
			.eq('update_id', updateId);

		if (error) {
			throw error;
		}

		return data;
	}

	// Crear un nuevo comentario
	async createComment(
		updateId: number,
		userId: string,
		fullName: string,
		comment: string
	) {
		const { data, error } = await this.supabase
			.from('update_comments')
			.insert([
				{
					update_id: updateId,
					user_id: userId,
					full_name: fullName,
					comment: comment,
				},
			]);

		if (error) {
			throw error;
		}

		return data;
	}

	// Actualizar un comentario existente
	async updateComment(commentId: number, comment: string) {
		const { data, error } = await this.supabase
			.from('update_comments')
			.update({ comment: comment, updated_at: new Date() })
			.eq('comment_id', commentId);

		if (error) {
			throw error;
		}

		return data;
	}

	// Eliminar un comentario
	async deleteComment(commentId: number) {
		const { data, error } = await this.supabase
			.from('update_comments')
			.delete()
			.eq('comment_id', commentId);

		if (error) {
			throw error;
		}

		return data;
	}
}
