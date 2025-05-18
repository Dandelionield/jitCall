import { Injectable } from '@angular/core';
import { ContactService } from '@core/services/contact/contact.service';
import { IStatement } from '@interfaces/statement/statement.interface';
import { IUserQuery } from './interfaces/user.query.interface';
import { User } from '@core/services/user/entities/user.entity';
import { Contact } from '@core/services/contact/entities/contact.entity';
import { environment } from '@environment/environment';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';

import { Firestore, collection, collectionData, deleteDoc, updateDoc, docData, doc, setDoc, getDoc, query, where, limit } from '@angular/fire/firestore';

@Injectable({

	providedIn: 'root'

}) export class UserService implements IUserQuery<User, Contact>, IStatement<User>{

	private readonly collectionName: string = environment.firebase.collections.user.name;
	private readonly subCollectionName: string = environment.firebase.collections.contact.name;
	private readonly collectionIDField: string = environment.firebase.collections.user.idField;

	public constructor(private firestore: Firestore, private contactService: ContactService) {}

	public findOne(key: string): Promise<User | undefined> {

		try{

			return getDoc(doc(

				collection(this.firestore, this.collectionName),
				key

			)).then((snapshot) => snapshot.data()) as Promise<User | undefined>;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);
			return undefined as unknown as Promise<undefined>;

		}

	}

	public findOneByContact(contact: Contact): Observable<User | undefined> {

		try{

			return collectionData(query(collection(this.firestore, this.collectionName), where('contact', '==', contact.contact), limit(1)), {

				idField: this.collectionIDField as keyof User

			}).pipe(map(

				users => users[0] as User | undefined

			)) as Observable<User>;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);

		}

	}

	/*public findOneWithContacts(key: string): Observable<User | undefined> {

		try{

			return docData(

				doc(this.firestore, `${this.collectionName}/${key}`),{

					idField: this.collectionIDField as keyof User

				}

			).pipe(

				switchMap(user => {

					if (!user) return of(undefined);

					this.contactService.setSuperKey(key);
					
					return this.contactService.findAll().pipe(

						map(contacts => ({
							...user,
							contacts: contacts
						}))

					);

				}), catchError(error => {

					console.error('Error fetching user with contacts:', error);
					return of(undefined);

				})

			) as Observable<User>;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);

		}

	}/**/

	public findAll(): Observable<Array<User>> {

		try{

			return collectionData(collection(this.firestore, this.collectionName), {

				idField: this.collectionIDField as keyof User

			}) as Observable<Array<User>>;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);

		}

	}
 
	public async insert(entity: User): Promise<string | undefined> {

		try{

			await setDoc(doc(this.firestore, `${this.collectionName}/${entity.id as string}`), entity);

			return entity.id as string;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);
			return undefined;

		}

	}

	public async update(key: string, entity: Partial<User>): Promise<boolean> {

		try{

			await updateDoc(doc(this.firestore, `${this.collectionName}/${key}`), entity);

			return true;

		}catch (e: any){

			throw new FirebaseError('Error', e.message);
			return false;

		}

	}

	public async delete(key: string): Promise<boolean> {

		try{

			await deleteDoc(doc(

				this.firestore,
				`${this.collectionName}/${key}`

			));

			return true;

		}catch (e: any){

			throw new FirebaseError('Error', e.message);
			return false;

		}

	}

}
