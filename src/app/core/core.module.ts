import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { firebaseConfig } from './config/env.config';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { UserService } from './services/user/user.service';
import { ContactService } from './services/contact/contact.service';
import { ChatService } from './services/chat/chat.service';
import { MessageService } from './services/message/message.service';
import { AuthService } from './services/auth/auth.service';
import { AuthGuard } from './guards/auth/auth.guard';
import { RavishingService } from './services/ravishing/ravishing.service';
import { CapacitorService } from './services/capacitor/capacitor.service';

@NgModule({

	declarations: [

		

	], imports: [

		HttpClientModule

	], exports: [

		

	], providers: [

		UserService,
		ContactService,
		ChatService,
		AuthService,
		AuthGuard,
		CapacitorService,
		RavishingService,
		provideFirebaseApp(

			() => initializeApp(firebaseConfig)

		), provideFirestore(

			() => getFirestore()

		), provideAuth(

			() => getAuth()

		)

	]

}) export class CoreModule {

	public constructor(@Optional() @SkipSelf() parentModule?: CoreModule){

		if (parentModule){

			throw new Error('CoreModule already rendered. Import it only at AppModule');

		}

	}

}