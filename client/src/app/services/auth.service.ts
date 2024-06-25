import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private supabaseClient: any;

	constructor(
		private http: HttpClient,
		private router: Router,
		private _ngZone: NgZone
	) {
		if (environment.supabaseUrl && environment.supabaseKey) {
			this.supabaseClient = createClient(
				environment.supabaseUrl,
				environment.supabaseKey
			);
		} else {
			throw new Error('Supabase URL or key is undefined.');
		}

		this.supabaseClient.auth.onAuthStateChange(
			(event: any, session: any) => {
				console.log('event', event);
				console.log('session', session);

				localStorage.setItem('session', JSON.stringify(session?.user));

				if (session?.user) {
					this._ngZone.run(() => {
						if (
							router
								.getCurrentNavigation()
								?.extractedUrl.toString()
								.includes('/app')
						)
							this.router.navigate(['/app/dashboard']);
					});
				}
			}
		);
	}

	get isLoggedIn(): boolean {
		const session = localStorage.getItem('session') as string;
		return session === 'undefined' ? false : true;
	}

	async signUp(
		full_name: string,
		email: string,
		password: string
	): Promise<any> {
		const { data, error } = await this.supabaseClient.auth.signUp({
			email,
			password,
		});

		console.log('user', data);

		if (error) {
			throw error;
		}

		await this.createUserProfile(data.user.id, full_name);

		return data;
	}

	private async createUserProfile(userId: string, fullName: string) {
		console.log('userId', userId, 'fullName', fullName);
		const { data, error } = await this.supabaseClient
			.from('user_profiles')
			.insert([{ id: userId, full_name: fullName }]);

		console.log('data', data, 'error', error);

		if (error) {
			throw error;
		}

		return data;
	}

	getUserProfile(userId: string): Observable<any> {
		return this.supabaseClient
			.from('user_profiles')
			.select('*')
			.eq('id', userId);
	}

	async signIn(email: string, password: string): Promise<any> {
		return this.supabaseClient.auth.signInWithPassword({ email, password });
	}

	async signOut(): Promise<any> {
		return this.supabaseClient.auth.signOut();
	}

	async isProjectCreator(
		userId: string,
		projectId: number
	): Promise<boolean> {
		// Busca el project mediante el projectId y verifica si el userId es igual al user_id del project
		const { data, error } = await this.supabaseClient
			.from('projects')
			.select('user_id')
			.eq('project_id', projectId)
			.single();

		return data.user_id === userId;
	}
}
