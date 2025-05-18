import { User } from '@core/services/user/entities/user.entity';

export interface Notification{

	title: string,
	body: User['name']

}