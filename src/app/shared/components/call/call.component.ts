import { Component, OnInit } from '@angular/core';
import { CallService } from '@shared/services/call/call.service';
import { Contact } from '@entities/contact.entity';
import { Observable } from 'rxjs';

@Component({

	selector: 'app-call',
	templateUrl: './call.component.html',
	styleUrls: ['./call.component.scss'],
	standalone: false

}) export class CallComponent implements OnInit {

	public isCalling$: Observable<boolean> = this.callService.isCalling$;
	public contact: Observable<Contact | null> = this.callService.inComingContact$;
	public callType: boolean = false;

	public constructor(private callService: CallService) {}

	public ngOnInit(): void {}

	public toggleCallType(): void {

		this.callType = !this.callType;

	}

	public hangUp(): void {

		this.callService.hangUp();

	}

}