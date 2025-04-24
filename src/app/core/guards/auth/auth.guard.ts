import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { RavishingService } from '@core/services/ravishing/ravishing.service';
import { take, map, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
	
	providedIn: 'root'

}) export class AuthGuard implements CanActivate{

	public constructor(private authService: AuthService, private ravishingService: RavishingService, private router: Router) {}

	public canActivate(): Observable<boolean> {

		return this.authService.authState$.pipe(take(1),

			switchMap(async (user) => {

				if (!user) {

					this.authService.logout();
					this.router.navigate(['/']);
					return false;

				}

				const currentToken = await this.authService.getCurrentToken();
				const storedToken = localStorage.getItem('access_token');

				//console.log(`currentToken !== storedToken: ${currentToken !== storedToken} because ${currentToken} es diferente a ${storedToken}`);

				if (currentToken !== storedToken){

					this.authService.logout();
					this.router.navigate(['/']);
					return false;

				}
				
				return true;

			})

		);

	}

}