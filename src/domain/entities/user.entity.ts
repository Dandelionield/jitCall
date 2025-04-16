import { Contact } from './contact.entity';

export interface User{

	id?: string,
	name: string,
	surname: string,
	contact: string,
	contacts?: Array<Contact>

}