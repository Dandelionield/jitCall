import { Entity } from '@models/entity.model';
//import { Contact } from '@core/services/contact/entities/contact.entity';

export interface User extends Entity<string>{

	token?: string,
	name: string,
	surname: string,
	contact: string,
	picture: string,
	//contacts?: Array<Contact>

}