import { Injectable } from '@angular/core';
import { IRavishingQuery } from './interfaces/ravishing.query.interface';
import { Ravishing } from '@models/ravishing.api.response';
import { Credential } from '@models/credential.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';

@Injectable({

	providedIn: 'root'

}) export class RavishingService implements IRavishingQuery<Ravishing>{

	private readonly credential: Credential = environment.ravishing.credentials;

	public constructor(private http: HttpClient) {}

	public findToken(): Observable<Ravishing>{

		return this.http.post<Ravishing>('https://ravishing-courtesy-production.up.railway.app/user/login', this.credential);

	}

}