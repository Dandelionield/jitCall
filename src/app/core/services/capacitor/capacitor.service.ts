import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { User } from '@entities/user.entity';

@Injectable({

	providedIn: 'root'

}) export class CapacitorService {

	public fcmToken: string | null = null;

	public constructor(private http: HttpClient) {}

	public async init(): Promise<void> {

		await this.requestPermissions();
		await this.registerListeners();

	}

	public sendNotification(token: string, user: User, meetingId: string, userFrom: string): Observable<any> {
		const payload = {

			token: token,
			notification: {

				title: 'Incoming call',
				body: `${user.name} ${user.surname} is calling you.`,

			}, android: {

				priority: 'high',
				data: {

					userId: user.id,
					meetingId: meetingId,
					type: 'incoming_call',
					name: user.name,
					userFrom: userFrom,

				}

			}

		};

		return this.http.post('https://ravishing-courtesy-production.up.railway.app/notifications', payload, {

			headers: new HttpHeaders({

				'Content-Type': 'application/json',

			})

		});

	}

	private async requestPermissions(): Promise<void> {

		const { receive } = await PushNotifications.requestPermissions();

		if (receive === 'granted') {

			await PushNotifications.register();

		}

	}

	private async registerListeners() {

		PushNotifications.addListener('registration', (token) => {

			this.fcmToken = token.value;

		});

		PushNotifications.addListener('pushNotificationReceived', (notification) => {

			

		});

		PushNotifications.addListener('pushNotificationActionPerformed', (action) => {

			

		});
	}

	public async getToken(): Promise<string | null> {

		return this.fcmToken;

	}

}
