import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ContactService } from '@core/services/contact/contact.service';
import { UserService } from '@core/services/user/user.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { Chat } from '@core/services/chat/entity/chat.entity';
import { User } from '@core/services/user/entity/user.entity';
import { Contact } from '@core/services/contact/entity/contact.entity';

@Component({

	selector: 'app-chat-header',
	templateUrl: './chat-header.component.html',
	styleUrls: ['./chat-header.component.scss'],
	standalone: false

}) export class ChatHeaderComponent implements OnInit {

	@Input() public chat!: Chat;
	@Input() public user_id!: string;
	public contact: Contact | User | undefined = undefined;

	public constructor(

		private contactService: ContactService,
		private userService: UserService,
		private swalService: SwalService,
		private location: Location

	) {}

	public ngOnInit() {

		this.loadContact();

	}

	public getChatName(): string {

		if (this.contact){

			return 'email' in this.contact ? this.contact.name+" "+this.contact.surname : this.contact.contact;

		}else{

			return this.chat.name;

		}

	}

	public getChatPicture(): string {

		if (this.contact){

			return this.contact.picture;

		}else{

			return this.chat.picture;

		}

	}

	private async loadContact(): Promise<void> {

		if (this.chat && this.user_id){

			if (!this.chat.typo){

				const key = this.chat.chatters[0]===this.user_id ? this.chat.chatters[1] : this.chat.chatters[0];

				this.contactService.setSuperKey(this.user_id);

				try{

					const cont: Contact | undefined = await this.contactService.findOne(key);

					this.contact = cont ? cont : await this.userService.findOne(key);

				}catch(e: any){

					this.swalService.showException('Error', e.message)

				}

			}

		}

	}

	public goBack(): void{

		this.location.back();

	}

}