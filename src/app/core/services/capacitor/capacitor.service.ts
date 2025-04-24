import { Injectable } from '@angular/core';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable({

	providedIn: 'root'

}) export class CapacitorService {

	private _notificationRecieved: BehaviorSubject<PushNotificationSchema | null> = new BehaviorSubject<PushNotificationSchema | null>(null);
	public notificationRecieved$: Observable<PushNotificationSchema | null> = this._notificationRecieved.asObservable();

	public fcmToken: string | null = null;

	public constructor(private http: HttpClient) {}

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

	public sendNotification(userFrom: User, userTo: User): Observable<any> | null {

		return this.fcmToken ? this.http.post('https://ravishing-courtesy-production.up.railway.app/notifications', {

			token: userTo.token as string,
			notification: {

				title: 'Incoming call',
				body: `${userFrom.name} ${userFrom.surname} is calling you.`,

			}, android: {

				priority: 'high',
				data: {

					userId: userTo.id,
					meetingId: uuidv4(),
					type: 'incoming_call',
					name: userTo.name,
					userFrom: userFrom.id,

				}

			}

		}, {

			headers: new HttpHeaders({

				'Content-Type': 'application/json',

			})

		}) : null;

	}

	public async getToken(): Promise<string | null> {

		return this.fcmToken;

	}

}
