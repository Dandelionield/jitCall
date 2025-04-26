import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { CallService } from '@shared/services/call/call.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Contact } from '@entities/contact.entity';
import { isRavishing } from '@models/ravishing.model';

@Component({

	selector: 'app-contact-tab',
	templateUrl: './contact-tab.component.html',
	styleUrls: ['./contact-tab.component.scss'],
	standalone: false

}) export class ContactTabComponent implements OnInit {

	@Input({

		required: true

	}) public contact!: Contact;

	public isCalling$: Observable<boolean> = this.callService.isCalling$;
	private userSub: Subscription | undefined = undefined;
	private callSub: Subscription | undefined = undefined;

	public constructor(

		private callService: CallService,
		private swalService: SwalService,
		private userService: UserService

	) {}

	public ngOnInit(): void {

		this.isCalling$.subscribe({

			next: (t) => {

				if (!t){

					if (this.userSub){

						this.userSub.unsubscribe();
						this.userSub = undefined;

					}

					if (this.callSub){

						this.callSub.unsubscribe();
						this.callSub = undefined;

					}

				}

			}, error: (e) => this.swalService.showException('Error', e.message)

		});

	}

	public call(callType: boolean = false): void {

		this.userSub = this.userService.findOneByContact(this.contact).pipe(take(1)).subscribe({

			next: async (t) => {

				if (t!=undefined){

					this.callService.setCallType(callType);
					this.callService.answer(this.contact);
					this.callService.show();

					this.callSub = (await this.callService.call(t)).subscribe({

						next: (t) => {

							console.log(t);

							if (!isRavishing(t)){

								this.swalService.showException('Error', t.msg);

							}

						}, error: (e) => this.swalService.showException('Error', e.message)

					});

				}else{

					this.swalService.showException('Error', `${this.contact.name} ${this.contact.surname} is not logged up on jitCall.`);
					this.callService.hangUp();

				}

			}, error: (e) => this.swalService.showException('Error', e.message)

		});

	}

}