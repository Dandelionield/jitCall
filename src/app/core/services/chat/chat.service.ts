import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { IStatement } from '@interfaces/statement/statement.interface';
import { IChatQuery } from './interfaces/chat.query.interface';
import { Chat } from './entity/chat.entity';
import { User } from '@core/services/user/entity/user.entity';
import { map } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';

import { Firestore, collection, collectionData, addDoc, deleteDoc, updateDoc, doc, getDocs, getDoc, query, where, orderBy, limit } from '@angular/fire/firestore';

@Injectable({

	providedIn: 'root'

}) export class ChatService implements IChatQuery, IStatement<Chat>{

	private readonly collectionName: string = environment.firebase.collections.chat.name;
	private readonly collectionIDField: string = environment.firebase.collections.chat.idField;

	public constructor(private firestore: Firestore) {}

	public findOne(key: Chat['id']): Promise<Chat | undefined> {

		try{

			return getDoc(doc(

				collection(this.firestore, this.collectionName),
				key

			)).then((snapshot) => snapshot.data()) as Promise<Chat | undefined>;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);

		}

	}

	public findAll(): Observable<Array<Chat>> {

		try{

			return collectionData(collection(this.firestore, this.collectionName), {

				idField: this.collectionIDField as keyof Chat

			}) as Observable<Array<Chat>>;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);

		}

	}

	public findAllByUser(user_key: User['id']): Observable<Array<Chat>>{

		try{

			return collectionData(query(

				collection(this.firestore, this.collectionName),
				where('chatters', 'array-contains', user_key),
				orderBy('updatedAt', 'desc')

			), { 

				idField: this.collectionIDField as keyof Chat 

			}) as Observable<Array<Chat>>;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);

		}

	}

	public async insert(entity: Chat): Promise<Chat['id'] | undefined> {

		try{

			const doc = await addDoc(

				collection(this.firestore, this.collectionName),
				entity

			);

			return doc.id;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);
			return undefined;

		}

	}

	public async update(key: Chat['id'], entity: Partial<Chat>): Promise<boolean> {

		try{

			await updateDoc(doc(

				this.firestore, `${this.collectionName}/${key}`

			), entity);

			return true;

		}catch (e: any){

			throw new FirebaseError('Error', e.message);
			return false;

		}

	}

	public async delete(key: Chat['id']): Promise<boolean> {

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