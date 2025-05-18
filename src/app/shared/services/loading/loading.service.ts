import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({

	providedIn: 'root'

}) export class LoadingService {

	private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public isLoading$: Observable<boolean> = this._isLoading.asObservable();
	public loadingMessage: string = 'loading';

	public constructor() {}

	public show(loadingMessage: string = 'loading'): void {

		this.loadingMessage = loadingMessage;
		this._isLoading.next(true);

	}

	public hide(): void {

		this._isLoading.next(false);

	}

}