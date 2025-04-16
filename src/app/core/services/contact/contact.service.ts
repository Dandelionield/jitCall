import { Injectable, Injector } from '@angular/core';
import { IStatement } from '@interfaces/statement/statement.interface';
import { IQuery } from '@interfaces/query/query.interface';
import { Contact, RawContact } from '@entities/contact.entity';
import { User } from '@entities/user.entity';
import { environment } from '@environment/environment';
import { map, switchMap, catchError } from 'rxjs/operators';
import { forkJoin, Observable, of, from, throwError, combineLatest } from 'rxjs';

import { Firestore, collection, collectionData, addDoc, deleteDoc, updateDoc, docData, doc, getDocs, query, where, DocumentReference } from '@angular/fire/firestore';

@Injectable({

	providedIn: 'root'

}) export class ContactService implements IQuery<Contact, 'id'>, IStatement<Contact, 'id'>{

	private readonly superCollectionName: string = environment.firebase.collections.user.name;
	private readonly collectionName: string = environment.firebase.collections.contact.name;
	private readonly collectionIDField: string = environment.firebase.collections.contact.idField;
	private superKey!: string;

	public constructor(private firestore: Firestore, private injector: Injector) {}

	public setSuperKey(superKey: string): void{

		this.superKey = superKey;

	}

	public findOne(key: string): Observable<Contact | undefined> {

		return docData(

			doc(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}/${key}`),{

				idField: this.collectionIDField as keyof Contact

			}

		).pipe(

			switchMap((rawContact) => {

				if (!rawContact) return of(undefined);
				
				const userRef = rawContact.user as DocumentReference<User>;
				
				return docData<User>(userRef).pipe(

					map(user => ({

						id: userRef.id,
						...user

					})), map(user => ({

						...rawContact,
						user: user

					}) as Contact)

				);

			}), catchError(error => {

				console.error('Error fetching contact:', error);
				return of(undefined);

			})

		);

	}

	public findAll(): Observable<Array<Contact>> {

		return from(getDocs(collection(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}`))).pipe(

			switchMap((rawContacts) => {

				if (rawContacts.empty) return of([]);

				return combineLatest(rawContacts.docs.map(rawContact => {

					const rawData = rawContact.data() as RawContact;
					const userRef = rawData.user as DocumentReference<User>;

					return docData<User>(userRef).pipe(

						map(user => ({

							id: userRef.id,
							...user

						}))

					).pipe(

						map(user => ({

							id: rawContact.id,
							...rawData,
							user: user

						}) as Contact)

					);

				}));

			}), catchError(error => {

				console.error('Error fetching contacts:', error);
				return of([]);

			})

		);

	}

	public async insert(entity: Contact): Promise<string> {

		const doc = await addDoc(

			collection(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}`),
			entity

		);

		return doc.id;

	}

	public async update(key: string, entity: Partial<Contact>): Promise<boolean> {

		try{

			await updateDoc(doc(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}/${key}`), entity);

			return true;

		}catch (error){

			console.error('Error updating Contact:', error);
			return false;

		}

	}

	public async delete(key: string): Promise<boolean> {

		try{

			await deleteDoc(doc(

				this.firestore,
				`${this.superCollectionName}/${this.superKey}/${this.collectionName}/${key}`

			));

			return true;

		}catch (error){

			console.error('Error deleting Contact:', error);
			return false;

		}

	}

}
