import { User } from '@entities/user.entity';

export interface Notification{

	title: string,
	body: User['name']

}