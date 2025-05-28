import { User } from '@core/services/user/entity/user.entity';

export interface Notification{

	title: string,
	body: User['name']

}