import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { User } from '@entities/user.entity';

@Component({

	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	standalone: false

}) export class HeaderComponent implements OnInit {

	@Input() public title: string = 'Page';
	@Input() public showBackButton: boolean = false;
	@Input({

		required: true

	}) public user!: User | undefined;

	public constructor(private authService: AuthService, private router: Router, private location: Location) {}

	public ngOnInit(): void {}

	public async logout(): Promise<void> {

		await this.authService.logout();
		this.router.navigate(['/']);

	}

	public goBack(): void{

		this.location.back();

	}

}