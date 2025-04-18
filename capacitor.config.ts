import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {

	appId: 'jitcall.videocall',
	appName: 'jitCall',
	webDir: 'www',
	plugins: {

		PushNotifications: {

			presentationOptions: ['badge', 'sound', 'alert']

		}

	}, android: {

		googleServicesFile: "./android/app/google-services.json"

	}

};

export default config;