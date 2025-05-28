import { Entity } from '@models/entity.model';
import { User } from '@core/services/user/entity/user.entity';

export interface Chat extends Entity<string>{

	chatters: Array<User['id']>,
	name: string,
	picture: string,
	typo: boolean,

}