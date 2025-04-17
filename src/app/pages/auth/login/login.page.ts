import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { Credential } from '@entities/credential.entity';

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

	public constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

	public ngOnInit(): void {}

	public async onSubmit(): Promise<void>{

		try{

			if (this.loginForm.invalid) {

				this.loginForm.markAllAsTouched();
				return;

			}

			const email = this.loginForm.get('email')?.value;
			const password = this.loginForm.get('password')?.value;

			if (!email || !password) {

				return;

			}

			const cred: Credential = {

				email: email,
				password: password

			};

			const token = await this.authService.login(cred);

			if (token){

				localStorage.setItem('access_token', token);
				this.router.navigate(['/home']);

			}

		}catch (e){

			

		}

	}

}
