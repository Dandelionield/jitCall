import { Injectable } from '@angular/core';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@entities/user.entity';
import { Contact } from '@entities/contact.entity';
import { ContactService } from '@core/services/contact/contact.service';
import { RavishingService } from '@core/services/ravishing/ravishing.service';
import { Ravishing } from '@models/ravishing.model';
import { Notification } from '@models/notification.model';
import { Data } from '@models/data.model';
import { Android } from '@models/android.model';
import { Playload } from '@models/playload.model';
import { Error } from '@models/error.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({

	providedIn: 'root'

}) export class CapacitorService {

	private _notificationRecieved: BehaviorSubject<PushNotificationSchema | null> = new BehaviorSubject<PushNotificationSchema | null>(null);
	public notificationRecieved$: Observable<PushNotificationSchema | null> = this._notificationRecieved.asObservable();

	public fcmToken: string | null = null;

	public constructor(private ravishingService: RavishingService, private contactService: ContactService) {}

	public async init(): Promise<string | undefined> {

		if (Capacitor.getPlatform() !== 'web'){

			await this.requestPermissions();
			return await this.addListeners();

		}

		return undefined;

	}

	private async requestPermissions(): Promise<void> {

		const { receive } = await PushNotifications.requestPermissions();

		if (receive === 'granted') {

			await PushNotifications.register();

		}

	}

	private async addListeners(): Promise<string | undefined> {

		return new Promise((resolve, reject) => {

			PushNotifications.addListener('registration', (token: Token) => {

				this.fcmToken = token.value;
				resolve(token.value);

			});

			PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {

				this._notificationRecieved.next(notification);

			});

			PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {

				

			});

		});

	}

	public async sendNotification(userFrom: User, userTo: User): Promise<Observable<Ravishing | Error>> {

		/*const contact: Contact | undefined = undefined;//await this.contactService.findOneByContactWithSuperKey(userTo.id as string, userFrom.contact);

		const contactFrom: User | Contact = contact ? contact : userFrom;

		const notification: Notification = {

			title: 'Incoming call',
			body: `${contactFrom.name} ${contactFrom.surname} is calling you.`

		}

		const data: Data = {

			userId: userTo.id,
			meetingId: uuidv4(),
			type: 'incoming_call',
			name: userTo.name,
			userFrom: userFrom.id,

		};

		const android: Android = {

			priority: 'high',
			data: data

		};

		const playload: Playload = {

			token: userTo.token,
			notification: notification,
			android: android

		};

		return this.ravishingService.send(playload);/**/

		return this.contactService.findOneByContactWithSuperKey(userTo.id as string, userFrom.contact).then(contact => {

			const contactFrom: User | Contact = contact ? contact : userFrom;

			const notification: Notification = {

				title: 'Incoming call',
				body: `${contactFrom.name} ${contactFrom.surname} is calling you.`

			}

			const data: Data = {

				userId: userTo.id,
				meetingId: uuidv4(),
				type: 'incoming_call',
				name: userTo.name,
				userFrom: userFrom.id,

			};

			const android: Android = {

				priority: 'high',
				data: data

			};

			const playload: Playload = {

				token: userTo.token,
				notification: notification,
				android: android

			};

			return this.ravishingService.send(playload);

		});

	}

	public async getToken(): Promise<string | null> {

		return this.fcmToken;

	}

}
