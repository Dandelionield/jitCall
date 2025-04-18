import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { ContactService } from '@core/services/contact/contact.service';
import { CloudinaryService } from '@core/services/cloudinary/cloudinary.service';
import { AuthService } from '@core/services/auth/auth.service';
import { Contact } from '@entities/contact.entity';
import { User } from '@entities/user.entity';
import { Router } from '@angular/router';
import { LoadingService } from '@shared/services/loading/loading.service';
import { SwalService } from '@shared/services/swal/swal.service';

@Component({

	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
	standalone: false,

}) export class HomePage {

	public user: User | undefined = undefined;
	public contacts!: Array<Contact>;
	public searchText: string = "";

	public constructor(

		private userService: UserService,
		private contactService: ContactService,
		private authService: AuthService,
		private swalService: SwalService,
		private loadingService: LoadingService,
		private cloudinaryService: CloudinaryService,
		private router: Router
		

	){}

	public ngOnInit(): void {

		this.loadingService.show();

		let id: string | null = this.authService.getCurrentUser();

		if (id!=null){

			this.userService.findOneByUID(id).subscribe({

				next: (t) => {

					if (t!=undefined && t.id!=undefined){

						this.user = t;

						this.contactService.setSuperKey(t.id);//('jrdMvZOMBmKcMsJHGULR');
						this.findAll();

					}

				}, error: (e) => this.swalService.showException('Error', e.message)

			});

		}

	}

	public findAll(): void {

		this.contactService.findAll().subscribe({

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