import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { IStatement } from '@interfaces/statement/statement.interface';
import { IQuery } from '@interfaces/query/query.interface';
import { Chat } from '@core/services/chat/entity/chat.entity';
import { Message } from './entity/message.entity';
import { map } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';

import { Firestore, collection, collectionData, addDoc, deleteDoc, updateDoc, doc, getDocs, getDoc, query, where, orderBy, limit } from '@angular/fire/firestore';

@Injectable({

	providedIn: 'root'

}) export class MessageService implements IQuery<Message>, IStatement<Message>{

	private readonly superCollectionName: string = environment.firebase.collections.chat.name;
	private readonly collectionName: string = environment.firebase.collections.message.name;
	private readonly collectionIDField: string = environment.firebase.collections.message.idField;
	private superKey!: Chat['id'];

	public constructor(private firestore: Firestore) {}

	public setSuperKey(superKey: Chat['id']): void{

		this.superKey = superKey;

	}

	public findOne(key: Message['id']): Promise<Message | undefined> {

		try{

			return getDoc(doc(

				collection(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}`),
				key

			)).then((snapshot) => snapshot.data()) as Promise<Message | undefined>;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);

		}

	}

	public findAll(): Observable<Array<Message>>{

		try{

			return collectionData(query(

				collection(this.firestore, `${this.superCollectionName}/${this.superKey}/${this.collectionName}`),
				orderBy('createdAt', 'desc')

			), { 

				idField: this.collectionIDField as keyof Message 

			}) as Observable<Array<Message>>;

		}catch(e: any){

			throw new FirebaseError('Error', e.message);

		}

	}

	public async insert(entity: Message): Promise<Message['id'] | undefined> {

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

	public async update(key: Message['id'], entity: Partial<Message>): Promise<boolean> {

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

	public async delete(key: Message['id']): Promise<boolean> {

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