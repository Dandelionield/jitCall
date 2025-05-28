import { Entity } from '@models/entity.model';

export interface Contact extends Entity<string>{

	name: string,
	surname: string,
	contact: string,
	picture: string,
	email: string

}