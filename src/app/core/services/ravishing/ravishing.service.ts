import { Injectable } from '@angular/core';
import { IRavishingQuery } from './interfaces/ravishing.query.interface';
import { IRavishingStatement } from './interfaces/ravishing.statement.interface';
import { Ravishing, RavishingToken } from '@models/ravishing.model';
import { Credential } from '@models/credential.model';
import { Playload } from '@models/playload.model';
import { Error } from '@models/error.model';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({

	providedIn: 'root'

}) export class RavishingService implements IRavishingQuery<RavishingToken, Credential, Error>, IRavishingStatement<Ravishing, Playload, Error>{

	private readonly credential: Credential = environment.ravishing.credentials;
	private readonly baseURL: string = environment.ravishing.baseURL;
	private readonly endpoints = {

		login: environment.ravishing.endpoints.login,
		notification: environment.ravishing.endpoints.notification

	};

	public constructor(private http: HttpClient) {}

	public findToken(cred: Credential = this.credential): Observable<RavishingToken | Error>{

		return this.http.post<RavishingToken | Error>(`${this.baseURL}/${this.endpoints['login']}`, cred);

	}

	public send(load: Playload): Observable<Ravishing | Error>{

		return this.http.post<{notification: Ravishing}>(`${this.baseURL}/${this.endpoints['notification']}`, load, {

			headers: new HttpHeaders({

				'Content-Type': 'application/json',

			})

		}).pipe(

			map((response: {notification: Ravishing}) => {

				const notification = response.notification;

				return {

					...notification

				} as Ravishing;

			})

		);

	}

}