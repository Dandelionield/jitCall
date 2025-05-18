import { environment } from '@environment/environment';

export const firebaseConfig = {

	apiKey: environment.firebase.credentials.apiKey,
	authDomain: environment.firebase.credentials.authDomain,
	projectId: environment.firebase.credentials.projectId,
	storageBucket: environment.firebase.credentials.storageBucket,
	messagingSenderId: environment.firebase.credentials.messagingSenderId,
	appId: environment.firebase.credentials.appId

};