import { Injectable } from '@angular/core';
import { IStatement } from '@interfaces/statement/statement.interface';
import { IContactQuery } from './interfaces/contact.query.interface';
import { Contact } from './entity/contact.entity';
import { User } from '@core/services/user/entity/user.entity';
import { environment } from '@environment/environment';
import { map } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';

import { Firestore, collection, collectionData, addDoc, deleteDoc, updateDoc, doc, getDocs, getDoc, setDoc, query, where, orderBy, limit } from '@angular/fire/firestore';

@Injectable({

	providedIn: 'root'

}) export class ContactService implements IContactQuery, IStatement<Contact>{

	private readonly superCollectionName: string = environment.firebase.collections.user.name;
	private readonly collectionName: string = environment.firebase.collections.contact.name;
	private readonly collectionIDField: string = environment.firebase.collections.contact.idField;
	private superKey!: User['id'];

	public constructor(private firestore: Firestore) {}

	public setSuperKey(superKey: User['id']): void{

		this.superKey = superKey;

	}

	public findOne(key: Contact['id']): Promise<Contact | undefined> {

		try{

			return getDoc(doc(

				collection(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}`),
				key

			)).then((snapshot) => snapshot.data()) as Promise<Contact | undefined>;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);

		}

	}

	public findByName(name: Contact['name']): Observable<Array<Contact>> {

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

	public findOneByContactWithSuperKey(superKey: User['id'], contact: Contact['contact']): Promise<Contact | undefined>{

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

		try{

			return collectionData(query(

				collection(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}`),
				orderBy('updatedAt', 'desc')

			), { 

				idField: this.collectionIDField as keyof Contact 

			}) as Observable<Array<Contact>>;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);

		}

	}

	public async insert(entity: Contact): Promise<Contact['id'] | undefined> {

		try{

			await setDoc(doc(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}/${entity.id as string}`), entity);

			return entity.id as string;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);
			return undefined;

		}

	}

	public async update(key: Contact['id'], entity: Partial<Contact>): Promise<boolean> {

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

	public async delete(key: Contact['id']): Promise<boolean> {

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
