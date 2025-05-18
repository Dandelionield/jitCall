import { Injectable } from '@angular/core';
import { IStatement } from '@interfaces/statement/statement.interface';
import { IContactQuery } from './interfaces/contact.query.interface';
import { Contact } from './entities/contact.entity';
import { User } from '@core/services/user/entities/user.entity';
import { environment } from '@environment/environment';
import { map } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';

import { Firestore, collection, collectionData, addDoc, deleteDoc, updateDoc, doc, getDocs, getDoc, query, where, limit } from '@angular/fire/firestore';

@Injectable({

	providedIn: 'root'

}) export class ContactService implements IContactQuery<Contact>, IStatement<Contact>{

	private readonly superCollectionName: string = environment.firebase.collections.user.name;
	private readonly collectionName: string = environment.firebase.collections.contact.name;
	private readonly collectionIDField: string = environment.firebase.collections.contact.idField;
	private superKey!: string;

	public constructor(private firestore: Firestore) {}

	public setSuperKey(superKey: string): void{

		this.superKey = superKey;

	}

	public findOne(key: string): Promise<Contact | undefined> {

		try{

			return getDoc(doc(

				collection(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}`),
				key

			)).then((snapshot) => snapshot.data()) as Promise<Contact | undefined>;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);

		}

	}

	public findByName(name: string): Observable<Array<Contact>> {

		try{

			return from(getDocs(query(collection(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}`)))).pipe(

				map(snapshot => snapshot.docs.map(

					doc => ({

						id: doc.id,
						...doc.data()

					}) as Contact
					
				).filter(

					Contact => Contact.name.toLowerCase().includes(name.toLowerCase().trim())

				))

			);

		}catch(e: any){

			throw new FirebaseError('Error', e.message);

		}

	}

	public findOneByContactWithSuperKey<User>(superKey: string, contact: string): Promise<Contact | undefined>{

		try{

			return getDocs(query(

				collection(this.firestore, `${this.superCollectionName}/${superKey}/${this.collectionName}`),
				where('contact', '==', contact),
				limit(1)

			)).then((snapshot) => {

				if (snapshot.empty) return undefined;

				return {

					id: snapshot.docs[0].id, 
					...snapshot.docs[0].data()

				} as Contact;

			}) as Promise<Contact | undefined>;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);

		}

	}

	public findAll(): Observable<Array<Contact>> {

		return collectionData(collection(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}`), {

			idField: this.collectionIDField as keyof Contact

		}) as Observable<Array<Contact>>;

	}

	public async insert(entity: Contact): Promise<string | undefined> {

		try{

			const doc = await addDoc(

				collection(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}`),
				entity

			);

			return doc.id;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);
			return undefined;

		}

	}

	public async update(key: string, entity: Partial<Contact>): Promise<boolean> {

		try{

			await updateDoc(doc(

				this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}/${key}`

			), entity);

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
				`${this.superCollectionName}/${this.superKey}/${this.collectionName}/${key}`

			));

			return true;

		}catch (e: any){

			throw new FirebaseError('Error', e.message);
			return false;

		}

	}

}
