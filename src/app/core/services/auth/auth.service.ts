import { Injectable, inject } from '@angular/core';
import { IAuth, Token } from './interfaces/auth.interface';
import { Router } from '@angular/router';
import {

	Auth,
	UserCredential,
	User as AuthUser,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	authState,
	onAuthStateChanged,
	browserSessionPersistence,
	setPersistence

} from '@angular/fire/auth';
import { FirebaseError } from '@angular/fire/app';
import { CapacitorService } from '@core/services/capacitor/capacitor.service';
import { UserService } from '@core/services/user/user.service';
import { User } from '@entities/user.entity';
import { Credential } from '@models/credential.model';
import { Observable } from 'rxjs';

@Injectable({

	providedIn: 'root'

}) export class AuthService implements IAuth<Credential, User>{

	public authState$: Observable<AuthUser | null>;

	public constructor(

		private auth: Auth,
		private userService: UserService,
		private capacitorService: CapacitorService

	){

		this.authState$ = authState(this.auth);

		onAuthStateChanged(this.auth, async (user) => {

			if (user) {

				const token = await user.getIdToken();
				localStorage.setItem('access_token', token);

			}else{

				localStorage.removeItem('access_token');
			}

		});

	}

	public getCurrentUser(): string | null{

		return this.auth.currentUser?.uid || null;

	}

	public isLoggedIn(): boolean {

		return !!this.auth.currentUser;

	}

	public async getCurrentToken(): Promise<string | null> {

		return await this.auth.currentUser?.getIdToken() || null;

	}

	public async login(cred: Credential): Promise<string> {

		try {

			await setPersistence(this.auth, browserSessionPersistence);
			const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, cred.email, cred.password);
			
			if (userCredential.user) {

				let DToken: string | null = await this.capacitorService.init();
				let uid: string = await userCredential.user.getIdToken();

				let tokens: Token = {

					UserToken: uid

				};

				if (DToken!=null){

					tokens = {

						DiviceToken: DToken,
		          		...tokens

					};

				}

				return uid;

			}else{

				throw new FirebaseError('404', 'Wrong credentials.');

			}

		}catch (e: any){

			if (e instanceof FirebaseError){

				throw e;

			}else{

				throw new Error(e.message);

			}

		}

	}

	public async logup(cred: Credential, user: User): Promise<string> {

		try {

			const userCredential = await createUserWithEmailAndPassword(this.auth, cred.email, cred.password);

			if (userCredential.user) {

				let DToken: string | null = await this.capacitorService.init();
				let uid: string = await userCredential.user.getIdToken();

				let id: string = await this.userService.insert({

					uid: uid,
					...user

				});

				return uid;

			}else{

				throw new FirebaseError('404', 'Wrong paramethers.');

			}

		}catch (e: any){

			if (e instanceof FirebaseError){

				throw e;

			}else{

				throw new Error(e.message);

			}

		}

	}

	public async logout(): Promise<void> {

		localStorage.removeItem('access_token');
		await signOut(this.auth);

	}

}
