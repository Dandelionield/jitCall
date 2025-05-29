import { Entity } from '@models/entity.model';
import { User } from '@core/services/user/entity/user.entity';

export interface Message extends Entity<string> {

	user: User['id'],
	content: string,
	typo: number,
	modified: boolean,
	state: boolean

}