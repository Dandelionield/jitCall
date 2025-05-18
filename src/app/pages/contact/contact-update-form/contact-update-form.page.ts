import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ContactService } from '@core/services/contact/contact.service';
import { UserService } from '@core/services/user/user.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { Contact } from '@core/services/contact/entities/contact.entity';
import { User } from '@core/services/user/entities/user.entity';
import { LoadingService } from '@shared/services/loading/loading.service';
import { SweetAlertResult } from 'sweetalert2';

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
		private swalService: SwalService,
		private loadingService: LoadingService,
		private router: Router,
		private activeRouter: ActivatedRoute

	) {}

	public async ngOnInit(): Promise<void> {

		this.loadingService.show();

		let id: string | null = this.authService.getCurrentUser();

		if (id!=null){

			this.contactService.setSuperKey(id);

			let user: User | undefined = await this.userService.findOne(id);

			if (user){

				this.user = user;

			}

			this.loadContact();

		}else{

			this.loadingService.hide();

		}

	}

	private async loadContact(): Promise<void> {

		let id: string = this.activeRouter.snapshot.paramMap.get('id') as string;

		let contact: Contact | undefined = await this.contactService.findOne(id);

		if (contact){

			this.contact = {

				id: id,
				...contact

			};

			this.loadForm();

		}

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

		let shot: SweetAlertResult = await this.swalService.getConfirmation('Question', `Are you sure you want to delete ${this.contact.name} ${this.contact.surname} from your contacts?`);

		if (shot.isConfirmed){

			this.delete();

		}

	}

	public async onSubmit(): Promise<void> {

		let shot: SweetAlertResult = await this.swalService.getConfirmation('Question', `Are you sure you want to update ${this.contact.name} ${this.contact.surname}'s contact information?`);

		if (shot.isConfirmed){

			this.update();

		}

	}

	private async delete(): Promise<void> {

		this.loadingService.show('Deleting');

		try{

			let success: boolean = await this.contactService.delete(this.contact.id as string);

			if (success){

				this.router.navigate(['/home']);

			}else{

				this.swalService.showException('Error', 'Unable to delete');

			}

		}catch (e: any){

			this.swalService.showException('Error', e.message);

		}finally{

			this.loadingService.hide();

		}

	}

	private async update(): Promise<void> {

		this.loadingService.show('Updating');

		try{

			if (this.contactForm.invalid) throw new Error('Invalid Paramethers');

			const name = this.contactForm.get('name')?.value;
			const surname = this.contactForm.get('surname')?.value;
			const cont = this.contactForm.get('contact')?.value;
			const email = this.contactForm.get('email')?.value;
			const picture = this.contactForm.get('picture')?.value;

			if (!email || !picture || !name || !surname || !cont) {

				throw new Error('Invalid Paramethers');

			}

			const conta: Contact = {

				name: name,
				surname: surname,
				contact: cont,
				email: email,
				picture: this.contact.picture

			};

			let success: boolean = await this.contactService.update(this.contact.id as string, conta);

			if (success){

				this.router.navigate(['/home']);

			}else{

				this.swalService.showException('Error', 'Unable to update');

			}

		}catch (e: any){

			this.swalService.showException('Error', e.message);

		}finally{

			this.loadingService.hide();

		}

	}

}