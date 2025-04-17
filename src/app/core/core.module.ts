import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { firebaseConfig } from './firebase/firebase.config';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { UserService } from './services/user/user.service';
import { ContactService } from './services/contact/contact.service';
import { AuthService } from './services/auth/auth.service';
import { AuthGuard } from './guards/auth/auth.guard';

@NgModule({

	declarations: [

		

	], imports: [

		

	], exports: [

		

	], providers: [

		provideFirebaseApp(

			() => initializeApp(firebaseConfig)

		), provideFirestore(

			() => getFirestore()

		), provideAuth(

			() => getAuth()

		), UserService,
		ContactService,
		AuthService,
		AuthGuard

	]

}) export class CoreModule {

	public constructor(@Optional() @SkipSelf() parentModule?: CoreModule){

		if (parentModule){

			throw new Error('CoreModule already rendered. Import it only at AppModule');

		}

	}

}