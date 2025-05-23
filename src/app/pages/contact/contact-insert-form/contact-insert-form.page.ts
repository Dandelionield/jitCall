import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ContactService } from '@core/services/contact/contact.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { LoadingService } from '@shared/services/loading/loading.service';
import { Router } from '@angular/router';
import { Contact } from '@core/services/contact/entities/contact.entity';

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

			const cont: Contact = {

				name: name,
				surname: surname,
				contact: contact,
				email: email,
				picture: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 131812794)}?v=4`//picture

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