export const environment = {

	production: false,
	firebase: {

		credentials: {

			apiKey: "AIzaSyCpYpi3CIYtBJr9NQrReRHsuwok0tIcSJM",
			authDomain: "jitcall-capacitor.firebaseapp.com",
			projectId: "jitcall-capacitor",
			storageBucket: "jitcall-capacitor.firebasestorage.app",
			messagingSenderId: "339902884710",
			appId: "1:339902884710:web:a1d3deab46c44cfe3436a7"

		}, collections: {

			user: {

				name: 'users',
				idField: 'id'

			}, contact: {

				name: 'contacts',
				idField: 'id'

			}

		}

	}

};