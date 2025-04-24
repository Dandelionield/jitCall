import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { CallService } from '@shared/services/call/call.service';
import { AuthService } from '@core/services/auth/auth.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { Subscription, Observable } from 'rxjs';
import { Contact } from '@entities/contact.entity';
import { User } from '@entities/user.entity';

@Component({

	selector: 'app-contact-tab',
	templateUrl: './contact-tab.component.html',
	styleUrls: ['./contact-tab.component.scss'],
	standalone: false

}) export class ContactTabComponent implements OnInit {

	@Input({

		required: true

	}) public contact!: Contact;

	public user: Subscription | undefined = undefined;
	public isCalling$: Observable<boolean> = this.callService.isCalling$;

	public constructor(

		private callService: CallService,
		private swalService: SwalService,
		private userService: UserService,
		private authService: AuthService

	) {}

	public ngOnInit(): void {

		this.isCalling$.subscribe({

			next: (t) => {

				if (this.user!=undefined && !t){

					this.user.unsubscribe();
					this.user = undefined;

				}

			}, error: (e) => this.swalService.showException('Error', e.message)

		});

	}

	public call(callType: boolean = false): void {

		this.user = this.userService.findOneByContact(this.contact).subscribe({

			next: async (t) => {

				if (t!=undefined){

					this.callService.setCallType(callType);
					this.callService.answer(this.contact);
					this.callService.show();

					this.callService.call(t);

				}else{

					this.swalService.showException('Error', `${this.contact.name} ${this.contact.surname} is not logged up on jitCall.`)
					this.callService.hangUp();

				}

			}, error: (e) => this.swalService.showException('Error', e.message)

		});

	}

}