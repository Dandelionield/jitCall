import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';

@Component({

	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
	standalone: false

}) export class AppComponent {

	public constructor(private authService: AuthService) {

		this.authService.authState$.subscribe({

			next: (t) => {

				

			}, error: (e) => console.error('Error:', e)

		});

	}

}
