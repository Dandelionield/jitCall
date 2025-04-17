import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({

	providedIn: 'root'

}) export class LoadingService {

	private _isLoading = new BehaviorSubject<boolean>(false);
	public isLoading$ = this._isLoading.asObservable();

	public constructor() {}

	public show(): void {

		this._isLoading.next(true);

	}

	public hide(): void {

		this._isLoading.next(false);

	}

}