import { Contact } from './contact.entity';

export interface User{

	id?: string,
	uid?: string,
	name: string,
	surname: string,
	contact: string,
	picture: string,
	contacts?: Array<Contact>

}