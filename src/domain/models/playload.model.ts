import { Notification } from './notification.model';
import { Android } from './android.model';
import { User } from '@core/services/user/entity/user.entity';

export interface Playload{

	token: User['token'],
	notification: Notification
	android: Android

}