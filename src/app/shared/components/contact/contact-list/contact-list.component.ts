import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactService } from '@core/services/contact/contact.service';
import { AuthService } from '@core/services/auth/auth.service';
import { Contact } from '@core/services/contact/entity/contact.entity';
import { User } from '@core/services/user/entity/user.entity';
import { Router } from '@angular/router';
import { LoadingService } from '@shared/services/loading/loading.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { Subscription } from 'rxjs';

@Component({

	selector: 'app-contact-list',
	templateUrl: './contact-list.component.html',
	styleUrls: ['./contact-list.component.scss'],
	standalone: false

}) export class ContactListComponent implements OnInit, OnDestroy {

	public contacts!: Array<Contact>;
	public user_id: User['id'];
	public searchText: string = "";
	private contactsSub: Subscription | undefined = undefined;

	public constructor(

		private contactService: ContactService,
		private authService: AuthService,
		private swalService: SwalService,
		private loadingService: LoadingService,
		private router: Router

	) {

		const id: string | null = this.authService.getCurrentUser();

		this.user_id = id ? id : '';

	}

	public ngOnInit(): void {

		this.loadingService.show();

		this.findAll();

	}

	public ngOnDestroy(): void {

		if (this.contactsSub){

			this.contactsSub.unsubscribe();

		}

	}

	public findAll(): void {

		this.contactService.setSuperKey(this.user_id);

		this.contactsSub = this.contactService.findAll().subscribe({

			next: (t) => {

				this.contacts = t;
				this.loadingService.hide();

			}, error: (e) => this.swalService.showException('Error', e.message)

		});

	}

	public findByName(): void {

		if (this.searchText!==""){

			this.contactService.findByName(this.searchText).subscribe({

				next: (t) => this.contacts = t,
				error: (e) => this.swalService.showException('Error', e.message)

			});

		}else{

			this.findAll();

		}

	}

	public navigateToInsert(): void {

		this.router.navigate(['/add']);

	}

}