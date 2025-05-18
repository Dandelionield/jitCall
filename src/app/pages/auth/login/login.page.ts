import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { SwalService } from '@shared/services/swal/swal.service';
import { LoadingService } from '@shared/services/loading/loading.service';
import { Credential } from '@models/credential.model';

@Component({

	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
	standalone: false

}) export class LoginPage implements OnInit {

	loginForm = this.fb.group({

		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required]]

	});

	public constructor(

		private fb: FormBuilder,
		private authService: AuthService,
		private swalService: SwalService,
		private loadingService: LoadingService,
		private router: Router

	) {}

	public ngOnInit(): void {}

	public async onSubmit(): Promise<void> {

		this.loadingService.show('Conecting');

		try{

			if (this.loginForm.invalid) {

				this.loginForm.markAllAsTouched();
				throw new Error('Invalid Paramethers');

			}

			const email = this.loginForm.get('email')?.value;
			const password = this.loginForm.get('password')?.value;

			if (!email || !password) {

				throw new Error('Invalid Paramethers');

			}

			const cred: Credential = {

				email: email,
				password: password

			};

			let UToken: string | undefined = await this.authService.login(cred);

			if (UToken){

				this.router.navigate(['/home']);

			}else{

				this.swalService.showException('Error', 'Unable to access');

			}

		}catch (e: any){

			this.swalService.showException('Error', e.message);

		}finally{

			this.loadingService.hide();

		}

	}

}
