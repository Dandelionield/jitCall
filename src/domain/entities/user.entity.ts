import { Contact } from './contact.entity';

export interface User{

	id?: string,
	uid?: string,
	token?: string,
	name: string,
	surname: string,
	contact: string,
	picture: string,
	contacts?: Array<Contact>

}