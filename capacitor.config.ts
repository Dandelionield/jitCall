import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {

	appId: 'jitcall.videocall',
	appName: 'jitCall',
	webDir: 'www',
	plugins: {

		PushNotifications: {

			presentationOptions: ['badge', 'sound', 'alert']

		}, Keyboard: {

			resize: 'body',
			style: 'dark',
			resizeOnFullScreen: true

		}

	}, android: {

		googleServicesFile: "./android/app/google-services.json"

	}, ios: {

		googleServicesFile: "./ios/App/App/GoogleService-Info.plist",
		scheme: 'jitCall',
		contentInset: 'always',
		allowsLinkPreview: false,
		scrollEnabled: false

	}

};

export default config;