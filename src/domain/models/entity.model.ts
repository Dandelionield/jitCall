import { Timestamp } from '@angular/fire/firestore';

export interface Entity<T> {

	id?: T,
	createdAt?: Timestamp,
	updatedAt?: Timestamp

}