import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '@core/services/contact/entity/contact.entity';
import { Router } from '@angular/router';
import { ContactTabService } from '@shared/services/contact-tab/contact-tab.service';

@Component({

	selector: 'app-contact-row',
	templateUrl: './contact-row.component.html',
	styleUrls: ['./contact-row.component.scss'],
	standalone: false

}) export class ContactRowComponent	implements OnInit {

	@Input({

		required: true

	}) public contact!: Contact;

	public isExpanded = false;

	public constructor(private router: Router, private contactTabService: ContactTabService) {

		this.contactTabService.isTabbed$.subscribe({

			next: (id) => {

				if (id && this.contact && this.contact.id){

					if (id!==this.contact.id){

						this.isExpanded = false;

					}

				}else{

					this.isExpanded = false;

				}

			}, error: (e) => {

				

			}

		});

	}

	public ngOnInit(): void {}

	public navigateToUpdate(event: Event): void {

		event.stopPropagation();
		this.router.navigate(['/update', this.contact.id]);

	}

	public toggleExpansion(event: Event): void {

		event.stopPropagation();
		this.isExpanded = !this.isExpanded;

		this.contactTabService.setTabbed(this.isExpanded ? this.contact.id : undefined);

	}

}
