import { Entity } from '@models/entity.model';
import { User } from '@core/services/user/entity/user.entity';
import { Message } from '@core/services/message/entity/message.entity';

export interface Chat extends Entity<string>{

	chatters: Array<User['id']>,
	lastContent: Message['content'],
	name: string,
	picture: string,
	typo: boolean,
	hash: string

}

export const hashChat = (chatters: Chat['chatters'], typo: Chat['typo']): Promise<string> => {

	return crypto.subtle.digest('SHA-256', new TextEncoder().encode(

		[...chatters].sort().join('') + typo.toString()

	)).then(hash => Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''));

}