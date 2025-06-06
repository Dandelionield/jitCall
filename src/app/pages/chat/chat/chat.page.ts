import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@shared/services/loading/loading.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { ChatService } from '@core/services/chat/chat.service';
import { AuthService } from '@core/services/auth/auth.service';
import { MessageService } from '@core/services/message/message.service';
import { Message } from '@core/services/message/entity/message.entity';
import { Chat } from '@core/services/chat/entity/chat.entity';
import { Timestamp } from '@angular/fire/firestore';

@Component({

	selector: 'app-chat',
	templateUrl: './chat.page.html',
	styleUrls: ['./chat.page.scss'],
	standalone: false

}) export class ChatPage implements OnInit {

	public chat!: Chat;
	public user_id: string;
	public text: string = '';

	public constructor(

		private chatService: ChatService,
		private messageService: MessageService,
		private authService: AuthService,
		private swalService: SwalService,
		private loadingService: LoadingService,
		private router: Router,
		private activeRouter: ActivatedRoute

	) {

		const id: string | null = this.authService.getCurrentUser();

		this.user_id = id ? id : '';

	}

	public ngOnInit() {

		this.loadingService.show('Loading Chat');

		let id: string = this.activeRouter.snapshot.paramMap.get('id') as string;

		this.loadChat(id);

	}

	public async send(): Promise<void> {

		const backUpText = this.text;

		this.text = '';

		try{

			const allow: boolean = backUpText.trim().length>0 && this.user_id!=='' && this.chat!==undefined;

			if (allow){

				const at: Timestamp = Timestamp.fromDate(new Date());

				const message: Message = {

					user: this.user_id,
					content: backUpText,
					typo: 0,
					modified: false,
					state: true,
					createdAt: at,
					updatedAt: at

				};

				const chat: Partial<Chat> = {

					lastContent: backUpText,
					updatedAt: at

				};

				this.messageService.setSuperKey(this.chat.id);

				await this.messageService.insert(message);

				this.chatService.update(this.chat.id, chat);

			}

		}catch(e: any){

			this.swalService.showException('Error', e.message);

		}

	}

	private async loadChat(id: string): Promise<void> {

		try{

			const ch: Chat | undefined = await this.chatService.findOne(id);

			if (!ch){

				throw new Error('Chat unavailable');

			}

			this.chat = {

				id: id,
				...ch

			};

		}catch(e: any){

			this.swalService.showException('Error', e.message);

		}finally{

			this.loadingService.hide();

		}

	}

}