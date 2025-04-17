import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ContactService } from '@core/services/contact/contact.service';
import { UserService } from '@core/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { Contact } from '@entities/contact.entity';
import { User } from '@entities/user.entity';
import { LoadingService } from '@shared/services/loading/loading.service';

@Component({

	selector: 'app-contact-update-form',
	templateUrl: './contact-update-form.page.html',
	styleUrls: ['./contact-update-form.page.scss'],
	standalone: false

}) export class ContactUpdateFormPage implements OnInit {

	public user!: User;
	public contact!: Contact;
	public contactForm = this.fb.group({

		name: ['', [Validators.required, Validators.minLength(3)]],
		surname: ['', [Validators.required]],
		contact: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
		email: ['', [Validators.required, Validators.email]],
		picture: ['']

	});

	public constructor(

		private fb: FormBuilder,
		private contactService: ContactService,
		private userService: UserService,
		private authService: AuthService,
		private loadingService: LoadingService,
		private router: Router,
		private ActiveRouter: ActivatedRoute

	) {}

	public async ngOnInit(): Promise<void> {

		this.loadingService.show();

		let id: string | null = this.authService.getCurrentUser();

		if (id!=null){

			this.userService.findOneByUID(id).subscribe({

				next: (t) => {

					if (t!=undefined && t.id!=undefined){

						this.user = t;

						this.contactService.setSuperKey(t.id);

						this.loadContact();

					}

				}, error: (e) => console.error('Error:', e)

			});

		}

	}

	private loadContact(): void {

		let id: string = this.ActiveRouter.snapshot.paramMap.get('id') as string;

		this.contactService.findOne(id).subscribe({

			next: (d) => {

				if (d!=undefined){

					this.contact = d;

					this.loadForm();

				}

			}, error: (e) => console.error('Error:', e)

		});

	}

	private loadForm(): void {

		this.contactForm.patchValue({

			name: this.contact.name,
			surname: this.contact.surname,
			contact: this.contact.contact,
			email: this.contact.email,
			picture: this.contact.email

		});

		this.loadingService.hide();

	}

	public async onDelete(): Promise<void> {

		let success: boolean = await this.contactService.delete(this.contact.id as string);
		this.router.navigate(['/home']);

	}

	public async onSubmit(): Promise<void> {

		if (this.contactForm.invalid) return;
		
		try{

			const name = this.contactForm.get('name')?.value;
			const surname = this.contactForm.get('surname')?.value;
			const cont = this.contactForm.get('contact')?.value;
			const email = this.contactForm.get('email')?.value;
			const picture = this.contactForm.get('picture')?.value;

			if (!email || !picture || !name || !surname || !cont) {

				return;

			}

			const conta: Contact = {

				name: name,
				surname: surname,
				contact: cont,
				email: email,
				picture: this.contact.picture

			};

			let success: boolean = await this.contactService.update(this.contact.id as string, conta);
			this.router.navigate(['/home']);

		}catch (e){

			

		}/**/

	}

}