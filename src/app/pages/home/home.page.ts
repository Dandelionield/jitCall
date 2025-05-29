import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { ChatService } from '@core/services/chat/chat.service';
import { MessageService } from '@core/services/message/message.service';
import { ContactService } from '@core/services/contact/contact.service';
import { AuthService } from '@core/services/auth/auth.service';
import { Contact } from '@core/services/contact/entity/contact.entity';
import { Router } from '@angular/router';
import { LoadingService } from '@shared/services/loading/loading.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { Subscription } from 'rxjs';

@Component({

	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
	standalone: false,

}) export class HomePage implements OnInit, OnDestroy {

	public showChats: boolean = true;

	public constructor(private swalService: SwalService){}

	public ngOnInit(): void {

		/*this.messageService.setSuperKey('phCn3NGNkavHOrJYVs0W');

		this.messageService.findAll().subscribe({

			next: (t) => {

				console.log(t);

			}, error: (e: any) => this.swalService.showException('Error', e.message)

		});/**/

	}

	public ngOnDestroy(): void {}

	public handleSegmentChange(event: CustomEvent) {

		this.showChats = event.detail.value === 'chats';

	}

}