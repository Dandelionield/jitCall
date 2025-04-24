import { Notification } from './notification.model';
import { Android } from './android.model';
import { User } from '@entities/user.entity';

export interface Playload{

	token: User['token'],
	notification: Notification
	android: Android

}