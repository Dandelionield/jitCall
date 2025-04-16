import { Component } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { ContactService } from '@core/services/contact/contact.service';

@Component({

	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
	standalone: false,

}) export class HomePage {

	public constructor(private userService: UserService, private contactService: ContactService) {

		this.userService.findOne('SjbMJji58vhNGSsqlKWb').subscribe({

			next: (t) => {

				if (t!=undefined && t.id!=undefined){

					this.contactService.setSuperKey(t.id);

					this.contactService.findOne('YUz5oLezXeSjA5dCctNH').subscribe({

						next: (u) => {

							console.log(u);

						}, error: (er) => {

							console.error('Error:', er);

						}

					});

					/*this.contactService.findAll().subscribe({

						next: (u) => {

							console.log('Array: ');
							console.log(u);

						}, error: (er) => {

							console.log('Error');
							console.log(er);
							console.error('Error:', er);

						}

					});/**/

				}

			}, error: (e) => console.error('Error:', e)

		});/**/

		/*this.userService.findOneWithContacts('SjbMJji58vhNGSsqlKWb').subscribe({

			next: (t) => {

				console.log(t);

			}, error: (e) => console.error('Error:', e)

		});/**/

	}

}