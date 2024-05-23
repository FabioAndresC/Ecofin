import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AuthExpressService {
	constructor(private http: HttpClient) {}

	register(data: any): Observable<any> {
		return this.http.post(`${apiUrls.authServiceApi}register`, data);
	}
}
