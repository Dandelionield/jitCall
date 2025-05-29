import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@core/services/user/user.service';
import { CallService } from '@shared/services/call/call.service';
import { ChatService } from '@core/services/chat/chat.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { LoadingService } from '@shared/services/loading/loading.service';
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Contact } from '@core/services/contact/entity/contact.entity';
import { User } from '@core/services/user/entity/user.entity';
import { Chat, hashChat } from '@core/services/chat/entity/chat.entity';
import { isRavishing } from '@models/ravishing.model';
import { Timestamp } from '@angular/fire/firestore';

@Component({

	selector: 'app-contact-tab',
	templateUrl: './contact-tab.component.html',
	styleUrls: ['./contact-tab.component.scss'],
	standalone: false

}) export class ContactTabComponent implements OnInit {

	@Input({

		required: true

	}) public contact!: Contact;
	@Input() public user_id: User['id'];

	public isCalling$: Observable<boolean> = this.callService.isCalling$;
	private callSub: Subscription | undefined = undefined;

	public constructor(

		private callService: CallService,
		private chatService: ChatService,
		private swalService: SwalService,
		private userService: UserService,
		private loadingService: LoadingService,
		private router: Router

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

	public async chat(): Promise<void> {

		this.loadingService.show('Generating Chat');

		try{

			if (this.user_id && this.contact && this.contact.id){

				const hash: string = await hashChat([this.user_id, this.contact.id], false);

				let chat: Chat | undefined = await this.chatService.findOneByHash(hash);

				if (!chat){

					const at: Timestamp = Timestamp.fromDate(new Date());

					chat = {

						chatters: [this.user_id, this.contact.id],
						lastContent: '',
						name: '...',
						picture: 'https://avatars.githubusercontent.com/u/0?v=4',
						typo: false,
						hash: hash,
						createdAt: at,
						updatedAt: at

					};

					const id: string | undefined = await this.chatService.insert(chat);

					if (id){

						this.router.navigate(['/chat', id]);

					}

				}else{

					this.router.navigate(['/chat', chat.id]);

				}

			}

		}catch(e: any){

			this.swalService.showException('Error', e.message);

		}finally{

			this.loadingService.hide();

		}

	}

}