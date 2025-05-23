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

	}, cloudinary: {

		baseURL: 'https://api.cloudinary.com/v1_1/',
		endpoints: {

			img: '/resources/image/upload'

		}, credentials: {

			cloud_name: 'dir7hha9x', 
			api_key: '491513494693695', 
			api_secret: 'n2b5YdbqCxrtNlRaOIOM7uZR43s',
			secure: true

		}

	}, ravishing: {

		baseURL: 'https://ravishing-courtesy-production.up.railway.app',
		endpoints: {

			login: 'user/login',
			notification: 'notifications'

		}, credentials: {

			email: 'felipe.maysalguedo@unicolombo.edu.co',
			password: '2025Cartagena_:3'

		}

	}

};