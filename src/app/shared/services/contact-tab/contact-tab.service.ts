import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '@entities/contact.entity';

@Injectable({

	providedIn: 'root'

}) export class ContactTabService {

	private _isTabbed: BehaviorSubject<Contact['id']> = new BehaviorSubject<Contact['id']>(undefined);
	public isTabbed$: Observable<Contact['id']> = this._isTabbed.asObservable();

	public constructor() {}

	public setTabbed(id: Contact['id']): void {

		this._isTabbed.next(id);

	}

}