import { Injectable } from '@angular/core';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class WebScrapingService {
	private supabaseClient: SupabaseClient;
	constructor(private http: HttpClient) {
		this.supabaseClient = createClient(
			environment.supabaseUrl,
			environment.supabaseKey
		);
	}

	// PATRON: PROTECCIÓN DE VARIACIONES
	// Al usar Any, estamos protegiendo el sistema de variaciones en el tipo de datos que se pueden recibir
	scrapeWebsite(url: string): Observable<any> {
		return this.http.get<any>(
			`http://localhost:3000/scrape?url=${encodeURIComponent(url)}`
		);
	}

	async updateOdsGoals() {
		const url = 'https://www.un.org/sustainabledevelopment/es/';
		this.scrapeWebsite(url).subscribe(async (metas) => {
			console.log(metas);
			// Gets all the data from the supabase table meta_ods
			const { data, error } = await this.supabaseClient
				.from('metas_ods')
				.select('*');
			if (error) {
				throw error;
			}

			if (data.length === 0) {
				// If the data doesn't exist, insert every item of the metas array
				metas.items.forEach(async (meta: string, index: number) => {
					await this.supabaseClient
						.from('metas_ods')
						.insert({
							objetivo: meta,
							id: index + 1,
							updated_at: new Date(),
						});
				});
			} else {
				// If the data exist, check if the data is the same as the metas array
				metas.items.forEach(async (meta: string, index: number) => {
					const metaData = data.find((m) => m.objetivo === meta);
					if (!metaData) {
						await this.supabaseClient
							.from('metas_ods')
							.insert({
								objetivo: meta,
								id: index + 1,
								updated_at: new Date(),
							});
					}
				});
			}
		});
	}

	async getOdsGoals() {
		const { data, error } = await this.supabaseClient
			.from('metas_ods')
			.select('*');
		if (error) {
			throw error;
		}

		return data;
	}
}
