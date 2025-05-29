import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@core/services/user/user.service';
import { ContactService } from '@core/services/contact/contact.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { LoadingService } from '@shared/services/loading/loading.service';
import { Router } from '@angular/router';
import { User } from '@core/services/user/entity/user.entity';
import { Contact } from '@core/services/contact/entity/contact.entity';
import { Timestamp } from '@angular/fire/firestore';

@Component({

	selector: 'app-contact-insert-form',
	templateUrl: './contact-insert-form.page.html',
	styleUrls: ['./contact-insert-form.page.scss'],
	standalone: false

}) export class ContactInsertFormPage implements OnInit {

	public contactForm = this.fb.group({

		name: ['', [Validators.required, Validators.minLength(3)]],
		surname: ['', [Validators.required]],
		contact: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
		email: ['', [Validators.required, Validators.email]],
		picture: ['https://ionicframework.com/docs/img/demos/avatar.svg']

	});

	public constructor(

		private fb: FormBuilder,
		private userService: UserService,
		private contactService: ContactService,
		private swalService: SwalService,
		private loadingService: LoadingService,
		private router: Router

	) {}

	public async ngOnInit(): Promise<void> {}

	public async onSubmit(): Promise<void> {

		this.loadingService.show('Validating');

		try{

			if (this.contactForm.invalid) throw new Error('Invalid Paramethers');

			const name = this.contactForm.get('name')?.value;
			const surname = this.contactForm.get('surname')?.value;
			const contact = this.contactForm.get('contact')?.value;
			const email = this.contactForm.get('email')?.value;
			const picture = this.contactForm.get('picture')?.value;

			if (!email || !picture || !name || !surname || !contact) {

				throw new Error('Invalid Paramethers');

			}

			const user: User | undefined = await this.userService.findOneByContact(contact.trim());
			const at: Timestamp = Timestamp.fromDate(new Date());

			if (!user){

				throw new Error(`User with contact ${contact} is not logged up on jitCall.`);

			}

			const cont: Contact = {

				id: user.id,
				name: name.trim(),
				surname: surname.trim(),
				contact: contact.trim(),
				email: email.trim(),
				picture: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 131812794)}?v=4`,//picture
				createdAt: at,
				updatedAt: at

			};

			let id: string | undefined = await this.contactService.insert(cont);

			if (id){

				this.router.navigate(['/home']);

			}else{

				this.swalService.showException('Error', 'Unable to add contact');

			}

		}catch (e: any){

			this.swalService.showException('Error', e.message);

		}finally{

			this.loadingService.hide();

		}

	}

}