import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '@entities/contact.entity';
import { User } from '@entities/user.entity';
import { Ravishing } from '@models/ravishing.model';
import { Error } from '@models/error.model';
import { AuthService } from '@core/services/auth/auth.service';
import { UserService } from '@core/services/user/user.service';
import { CapacitorService } from '@core/services/capacitor/capacitor.service';

@Injectable({

	providedIn: 'root'

}) export class CallService {

	private _isCalling: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public isCalling$: Observable<boolean> = this._isCalling.asObservable();

	private _inComingContact: BehaviorSubject<Contact | null> = new BehaviorSubject<Contact | null>(null);
	public inComingContact$: Observable<Contact | null> = this._inComingContact.asObservable();

	private _callType: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public callType$: Observable<boolean> = this._callType.asObservable();

	private user!: User;

	public constructor(private userService: UserService, private authService: AuthService, private capacitorService: CapacitorService) {

		this.getUser();

	}

	public show(): void {

		this._isCalling.next(true);

	}

	public hide(): void {

		this._isCalling.next(false);

	}

	public setCallType(callType: boolean): void {

		this._callType.next(callType);

	}

	public hangUp(): void {

		this.answer();
		this.hide();

	}

	public answer(contact: Contact | null = null): void {

		this._inComingContact.next(contact);

	}

	public call(userTo: User): Observable<Ravishing | Error> {

		return this.capacitorService.sendNotification(this.user, userTo);

	}

	private async getUser(): Promise<void> {

		let id: string | null = this.authService.getCurrentUser();

		if (id){

			let u: User | undefined = await this.userService.findOne(id);

			if (u){

				this.user = u;

			}

		}/**/

	}

}
