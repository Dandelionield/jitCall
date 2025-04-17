import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ContactService } from '@core/services/contact/contact.service';
import { UserService } from '@core/services/user/user.service';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { Contact } from '@entities/contact.entity';
import { User } from '@entities/user.entity';

@Component({

	selector: 'app-contact-insert-form',
	templateUrl: './contact-insert-form.page.html',
	styleUrls: ['./contact-insert-form.page.scss'],
	standalone: false

}) export class ContactInsertFormPage implements OnInit {

	public user!: User;
	public contactForm = this.fb.group({

		name: ['', [Validators.required, Validators.minLength(3)]],
		surname: ['', [Validators.required]],
		contact: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
		email: ['', [Validators.required, Validators.email]],
		picture: ['https://ionicframework.com/docs/img/demos/avatar.svg']

	});

	public constructor(private fb: FormBuilder, private contactService: ContactService, private userService: UserService, private authService: AuthService, private router: Router) {}

	public async ngOnInit(): Promise<void> {

		let id: string | null = this.authService.getCurrentUser();

		if (id!=null){

			this.userService.findOneByUID(id).subscribe({

				next: (t) => {

					if (t!=undefined && t.id!=undefined){

						this.contactService.setSuperKey(t.id);

						this.user = t;

					}

				}, error: (e) => console.error('Error:', e)

			});

		}

	}

	public async onSubmit(): Promise<void> {

		if (this.contactForm.invalid) return;
		
		try{

			const name = this.contactForm.get('name')?.value;
			const surname = this.contactForm.get('surname')?.value;
			const contact = this.contactForm.get('contact')?.value;
			const email = this.contactForm.get('email')?.value;
			const picture = this.contactForm.get('picture')?.value;

			if (!email || !picture || !name || !surname || !contact) {

				return;

			}

			const cont: Contact = {

				name: name,
				surname: surname,
				contact: contact,
				email: email,
				picture: picture

			};

			let id: string = await this.contactService.insert(cont);
			this.router.navigate(['/home']);

		}catch (e){

			

		}

	}

}