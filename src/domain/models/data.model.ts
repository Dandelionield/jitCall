import { User } from '@core/services/user/entity/user.entity';

export interface Data{

	userId: User['id'],
	meetingId: string,
	type: string,
	name: User['name'],
	userFrom: User['id']

}