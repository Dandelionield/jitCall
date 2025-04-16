import { User } from './user.entity';
import { DocumentReference } from '@angular/fire/firestore';

export interface Contact{

	id?: string,
	user: User

}

export interface RawContact{

	id?: string,
	user: DocumentReference<User>

}