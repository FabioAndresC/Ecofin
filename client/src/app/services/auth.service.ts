import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
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
		this.supabaseClient = createClient(
			environment.supabaseUrl,
			environment.supabaseKey
		);

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

	async signUp(email: string, password: string): Promise<any> {
		return this.supabaseClient.auth.signUp({ email, password });
	}

	async signIn(email: string, password: string): Promise<any> {
		return this.supabaseClient.auth.signInWithPassword({ email, password });
	}

	async signOut(): Promise<any> {
		return this.supabaseClient.auth.signOut();
	}

	async isProjectCreator(userId: string, projectId: number): Promise<boolean> {
		// Busca el project mediante el projectId y verifica si el userId es igual al user_id del project
		const { data, error } = await this.supabaseClient
			.from('projects')
			.select('user_id')
			.eq('project_id', projectId)
			.single();

		return data.user_id === userId;
	}
}
