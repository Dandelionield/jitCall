import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { CloudinaryResource } from '@models/cloudinary-resource.model';
import { environment } from '@environment/environment';
import { cloudinaryConfig } from '@core/config/env.config';

@Injectable({

	providedIn: 'root'

}) export class CloudinaryService {

	private baseURL: string = environment.cloudinary.baseURL;
	private img: string = environment.cloudinary.endpoints.img;

	public constructor(

		@Inject('CLOUDINARY') private cldFrontend: Cloudinary,
		private http: HttpClient

	) {}

	public findOne(key: string): Observable<CloudinaryResource | undefined>{

		let url: CloudinaryImage = this.cldFrontend.image(key);

		console.log(url);

		let picture: CloudinaryResource = {

			id: key,
			url: url.toURL()

		};

		return of(picture);

	}

	public findAll(): Observable<Array<CloudinaryResource>> {

		const cloudName = cloudinaryConfig.cloudName;
		const apiKey = cloudinaryConfig.apiKey;

		const params = new HttpParams().set('max_results', '500').set('type', 'upload').set('api_key', apiKey);

		return this.http.get<any>(`${this.baseURL}${cloudName}${this.img}`, { params }).pipe(

			map(response => {

				return response.resources.map((resource: any) => ({

					id: resource.public_id,
					url: resource.secure_url//this.cloudinary.image(resource.public_id).toURL()

				}));

			}), catchError(e => {

				console.error('Error fetching images:', e);
				throw new Error('Failed to retrieve images');

			})

		);

	}

}