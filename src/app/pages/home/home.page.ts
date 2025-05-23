import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { ContactService } from '@core/services/contact/contact.service';
import { AuthService } from '@core/services/auth/auth.service';
import { Contact } from '@core/services/contact/entities/contact.entity';
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

	public contacts!: Array<Contact>;
	public searchText: string = "";
	private contactsSub: Subscription | undefined = undefined;

	public constructor(

		private userService: UserService,
		private contactService: ContactService,
		private authService: AuthService,
		private swalService: SwalService,
		private loadingService: LoadingService,
		private router: Router
		

	){}

	public ngOnInit(): void {

		this.loadingService.show();

		let id: string | null = this.authService.getCurrentUser();

		if (id){

			this.contactService.setSuperKey(id);

		}

		this.findAll();

	}

	public ngOnDestroy(): void {

		if (this.contactsSub){

			this.contactsSub.unsubscribe();

		}

	}

	public findAll(): void {

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