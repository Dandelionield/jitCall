import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '@entities/contact.entity';
import { Router } from '@angular/router';

@Component({

	selector: 'app-contact-row',
	templateUrl: './contact-row.component.html',
	styleUrls: ['./contact-row.component.scss'],
	standalone: false

}) export class ContactRowComponent	implements OnInit {

	@Input({

		required: true

	}) public contact!: Contact;

	public constructor(private router: Router) {}

	public ngOnInit() {}

	public navigateToUpdate(): void {

		this.router.navigate(['/update', this.contact.id]);

	}

}
