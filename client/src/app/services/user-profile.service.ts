import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { UserProfile } from '../models/user-profile';

@Injectable({
	providedIn: 'root',
})
export class UserProfileService {
	private supabase: SupabaseClient;

	constructor() {
		this.supabase = createClient(
			environment.supabaseUrl,
			environment.supabaseKey
		);
	}

	// Obtener el perfil de usuario
	async getUserProfile(userId: string): Promise<UserProfile | null> {
		const { data, error } = await this.supabase
			.from('user_profiles')
			.select('*')
			.eq('id', userId)
			.single();

		if (error) {
			console.error('Error fetching user profile:', error);
			return null;
		}

		return data;
	}

	// Crear o actualizar el perfil de usuario
	async upsertUserProfile(
		userProfile: UserProfile
	): Promise<UserProfile | null> {
		const { data, error } = await this.supabase
			.from('user_profiles')
			.upsert(userProfile);

		if (error) {
			console.error('Error upserting user profile:', error);
			return null;
		}

		return data;
	}
}
