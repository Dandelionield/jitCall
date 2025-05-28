import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { CallService } from '@shared/services/call/call.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { LoadingService } from '@shared/services/loading/loading.service';
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Contact } from '@core/services/contact/entity/contact.entity';
import { User } from '@core/services/user/entity/user.entity';
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
	private callSub: Subscription | undefined = undefined;

	public constructor(

		private callService: CallService,
		private swalService: SwalService,
		private userService: UserService,
		private loadingService: LoadingService,

	) {}

	public ngOnInit(): void {

		this.isCalling$.subscribe({

			next: (t) => {

				if (!t){

					if (this.callSub){

						this.callSub.unsubscribe();
						this.callSub = undefined;

					}

				}

			}, error: (e) => this.swalService.showException('Error', e.message)

		});

	}

	public async call(callType: boolean = false): Promise<void> {

		this.loadingService.show('Calling');

		try{

			const user: User | undefined = await this.userService.findOne(this.contact.id);

			if (user!=undefined){

				this.callService.setCallType(callType);
				this.callService.answer(this.contact);
				this.callService.show();

				this.callSub = (await this.callService.call(user)).subscribe({

					next: (t) => {

						console.log(t);

						if (!isRavishing(t)){

							this.swalService.showException('Error', t.msg);

						}

					}, error: (e) => this.swalService.showException('Error', e.message)

				});

			}else{

				this.swalService.showException('Error', `${this.contact.name} ${this.contact.surname} is not logged up on jitCall any longer.`);
				this.callService.hangUp();

			}

		}catch(e: any){

			this.callService.hangUp();
			this.swalService.showException('Error', e.message);

		}finally{

			this.loadingService.hide();

		}

	}

}