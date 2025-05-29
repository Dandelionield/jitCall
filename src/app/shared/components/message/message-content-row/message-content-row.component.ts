import { Component, OnInit, Input } from '@angular/core';
import { ContactService } from '@core/services/contact/contact.service';
import { UserService } from '@core/services/user/user.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { Message } from '@core/services/message/entity/message.entity';
import { User } from '@core/services/user/entity/user.entity';
import { Contact } from '@core/services/contact/entity/contact.entity';
import { Timestamp } from '@angular/fire/firestore';

@Component({

	selector: 'app-message-content-row',
	templateUrl: './message-content-row.component.html',
	styleUrls: ['./message-content-row.component.scss'],
	standalone: false

}) export class MessageContentRowComponent	implements OnInit {

	@Input() public message!: Message;
	@Input() public user_id: User['id'];
	@Input() public isGroup!: boolean;
	@Input() public showAvatar: boolean = false;
	public contact: Contact | User | undefined = undefined;

	public constructor(

		private contactService: ContactService,
		private userService: UserService,
		private swalService: SwalService

	) {}

	public ngOnInit() {

		this.loadContact();

	}

	public getChatterName(): string {

		if (!this.contact) return '';

		return 'email' in this.contact ? this.contact.name+" "+this.contact.surname : this.contact.contact;

	}

	public getContactPicture(): string {

		if (!this.contact) return '';

		return this.contact.picture;

	}

	public isCurrentUser(): boolean {

		return this.message.user === this.user_id;

	}

	public formatTimestamp(timestamp?: Timestamp): string {

		if (!timestamp) return '';
		
		const date = timestamp.toDate();

		return date.toLocaleTimeString('en-US', {

			hour: 'numeric',
			minute: '2-digit',
			hour12: true

		}) + ', ' + date.toLocaleDateString('en-US', {

			month: 'short',
			day: 'numeric'

		});

	}

	private async loadContact(): Promise<void> {

		if (this.user_id){

			const key = this.message.user;

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