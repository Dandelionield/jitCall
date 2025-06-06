import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { ChatService } from '@core/services/chat/chat.service';
import { Chat } from '@core/services/chat/entity/chat.entity';
import { LoadingService } from '@shared/services/loading/loading.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { Subscription } from 'rxjs';

@Component({

	selector: 'app-chat-list',
	templateUrl: './chat-list.component.html',
	styleUrls: ['./chat-list.component.scss'],
	standalone: false

}) export class ChatListComponent implements OnInit, OnDestroy {

	@Input() public user_id!: string;
	public chats: Array<Chat> = [];
	private chatsSub: Subscription | undefined = undefined;

	public constructor(

		private authService: AuthService,
		private chatService: ChatService,
		private swalService: SwalService,
		private loadingService: LoadingService,
		private router: Router

	) {

		const id: string | null = this.authService.getCurrentUser();

		this.user_id = id ? id : '';

	}

	public ngOnInit(): void {

		this.loadingService.show('Loading Chats');

		this.findAll();

	}

	public ngOnDestroy(): void {

		if (this.chatsSub){

			this.chatsSub.unsubscribe();

		}

	}

	private findAll(): void {

		if (this.user_id){

			this.chatsSub = this.chatService.findAllByUser(this.user_id).subscribe({

				next: (t) => {

					this.chats = t;
					this.loadingService.hide();

				}, error: (e: any) => this.swalService.showException('Error', e.message)

			});

		}

	}

}