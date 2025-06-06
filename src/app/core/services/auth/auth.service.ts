import { Injectable, inject } from '@angular/core';
import { IAuth } from './interfaces/auth.interface';
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
import { RavishingService } from '@core/services/ravishing/ravishing.service';
import { User } from '@core/services/user/entity/user.entity';
import { Credential } from '@models/credential.model';
import { isRavishingToken } from '@models/ravishing.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { SwalService } from '@shared/services/swal/swal.service';

@Injectable({

	providedIn: 'root'

}) export class AuthService implements IAuth<Credential, User>{

	private _loggedUser: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
	public loggedUser$: Observable<User | undefined> = this._loggedUser.asObservable();
	public authState$: Observable<AuthUser | null>;

	private token!: string;

	public constructor(

		private auth: Auth,
		private userService: UserService,
		private ravishingService: RavishingService,
		private capacitorService: CapacitorService,
		private swalService: SwalService

	){

		this.authState$ = authState(this.auth);

		onAuthStateChanged(this.auth, async (user) => {

			if (user) {

				/*this.ravishingService.findToken().subscribe({

					next: (ravishing) => {

						if (isRavishingToken(ravishing)){

							const token: string = ravishing.data.access_token.replace("Bearer ", "");

							this.token = token;

							localStorage.setItem('access_token', token);
							//console.log(token);

						}else{

							localStorage.setItem('access_token', '')

						}

					}, error: (e: any) => this.swalService.showException('Error', e.message)

				});/**/

				let u: User | undefined = await this.userService.findOne(user.uid);
				this._loggedUser.next(u);

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

	public getCurrentToken(): string {

		return this.token as string;

		//return await this.auth.currentUser?.getIdToken() || null;

	}

	public async login(cred: Credential): Promise<string | undefined> {

		try {

			await setPersistence(this.auth, browserSessionPersistence);
			const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, cred.email, cred.password);
			
			if (userCredential.user) {

				let DToken: string | undefined = await this.capacitorService.init();
				let UToken: string = await userCredential.user.getIdToken();

				let user: User | undefined = await this.userService.findOne(userCredential.user.uid);

				if (DToken!=undefined){

					this.userService.update(userCredential.user.uid, {

						token: DToken

					});

				}

				this._loggedUser.next(user);

				return UToken;

			}else{

				throw new FirebaseError('ERROR', 'Wrong credentials.');
				return undefined;

			}

		}catch (e: any){

			if (e instanceof FirebaseError){

				throw e;

			}else{

				throw new Error(e.message);

			}

			return undefined;

		}

	}

	public async logup(cred: Credential, user: User): Promise<string | undefined> {

		try {

			const userCredential = await createUserWithEmailAndPassword(this.auth, cred.email, cred.password);

			if (userCredential.user) {

				let DToken: string | undefined = await this.capacitorService.init();
				let UToken: string = await userCredential.user.getIdToken();

				user.id = userCredential.user.uid;

				let id: string | undefined = await this.userService.insert(DToken!=undefined ? {

					token: DToken,
					...user

				} : user);

				if (!id){

					throw new FirebaseError('Error', 'Unable to log');

				}

				this._loggedUser.next(user);

				return UToken;

			}else{

				throw new FirebaseError('404', 'Wrong paramethers.');
				return undefined;

			}

		}catch (e: any){

			if (e instanceof FirebaseError){

				throw e;

			}else{

				throw new Error(e.message);

			}

			return undefined;

		}

	}

	public async logout(): Promise<void> {

		localStorage.removeItem('access_token');
		this._loggedUser.next(undefined);
		await signOut(this.auth);

	}

}
