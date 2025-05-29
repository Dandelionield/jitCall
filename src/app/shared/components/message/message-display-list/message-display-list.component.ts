import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { MessageService } from '@core/services/message/message.service';
import { Message } from '@core/services/message/entity/message.entity';
import { Chat } from '@core/services/chat/entity/chat.entity';
import { User } from '@core/services/user/entity/user.entity';
import { LoadingService } from '@shared/services/loading/loading.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { Subscription } from 'rxjs';

@Component({

	selector: 'app-message-display-list',
	templateUrl: './message-display-list.component.html',
	styleUrls: ['./message-display-list.component.scss'],
	standalone: false

}) export class MessageDisplayListComponent implements OnInit, OnDestroy {

	@Input() public chat!: Chat;
	public messages: Array<{message: Message, showAvatar: boolean}> = [];
	public user_id: User['id'];
	private lastUserMessage: User['id'] = undefined;
	private messagesSub: Subscription | undefined = undefined;

	public constructor(

		private messageService: MessageService,
		private authService: AuthService,
		private swalService: SwalService,
		private loadingService: LoadingService,
		private router: Router

	) {

		const id: string | null = this.authService.getCurrentUser();

		this.user_id = id ? id : '';

	}

	public ngOnInit() {

		this.loadingService.show('Loading Messages');

		this.findAll();

	}

	public ngOnDestroy(): void {

		if (this.messagesSub){

			this.messagesSub.unsubscribe();

		}

	}

	public sendLastUserMessage(message: Message): string {

		if (this.lastUserMessage){

			const backUp = this.lastUserMessage;

			this.lastUserMessage = message.user;

			return backUp;

		}else{

			this.lastUserMessage = message.user;

			return '';

		}

	}

	private processMessages(messages: Array<Message>): Array<{message: Message, showAvatar: boolean}> {

		let lastUserId: string | undefined = undefined;
		
		return messages.map(message => {

			const showAvatar = message.user !== lastUserId;
			lastUserId = message.user;

			return { message: message, showAvatar: showAvatar };

		});

	}

	private findAll(): void {

		this.messageService.setSuperKey(this.chat.id);

		this.messagesSub = this.messageService.findAll().subscribe({

			next: (t) => {

				this.messages = this.processMessages(t.reverse()).reverse();
				this.loadingService.hide();

			}, error: (e: any) => this.swalService.showException('Error', e.message)

		});

	}

}