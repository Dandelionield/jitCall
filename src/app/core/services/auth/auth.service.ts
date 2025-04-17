import { Injectable, inject } from '@angular/core';
import { IAuth } from './interfaces/auth.interface';
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
import { UserService } from '@core/services/user/user.service';
import { User } from '@entities/user.entity';
import { Credential } from '@entities/credential.entity';
import { Observable } from 'rxjs';

@Injectable({

	providedIn: 'root'

}) export class AuthService implements IAuth<Credential, User>{

	public authState$: Observable<AuthUser | null>;

	public constructor(private auth: Auth, private userService: UserService){

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

		if (this.auth.currentUser==null) return null;

		return this.auth.currentUser.uid;

	}

	public isLoggedIn(): boolean {

		return !!this.auth.currentUser;

	}

	public async getCurrentToken(): Promise<string | null> {

		return await this.auth.currentUser?.getIdToken() || null;

	}

	public async login(cred: Credential): Promise<string | undefined> {

		try {

			await setPersistence(this.auth, browserSessionPersistence);
			const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, cred.email, cred.password);
			
			if (userCredential.user) {

				return userCredential.user.getIdToken();

			}else{

				return undefined;

			}

		}catch (e: any){

			return undefined;

		}

	}

	public async logup(cred: Credential, user: User): Promise<string | undefined> {

		try {

			const userCredential = await createUserWithEmailAndPassword(this.auth, cred.email, cred.password);

			if (userCredential.user) {

				let id: string = await this.userService.insert({

					uid: userCredential.user.uid,
					...user

				});

				return userCredential.user.getIdToken();

			}else{

				return undefined

			}

		}catch (error){

			return undefined;

		}

	}

	public async logout(): Promise<void> {

		localStorage.removeItem('access_token');
		await signOut(this.auth);

	}

}
