import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DividerModule } from 'primeng/divider';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		CommonModule,
		InputTextModule,
		ButtonModule,
		DividerModule,
		ToggleButtonModule,
		ReactiveFormsModule,
		ToastModule,
	],
	providers: [MessageService],
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export default class RegisterComponent implements OnInit {
	formGroup: FormGroup = new FormGroup({});

	constructor(
		private authService: AuthService,
		private router: Router,
		private messageService: MessageService
	) {}

	ngOnInit(): void {
		this.setForm();
	}

	setForm(): void {
		this.formGroup = new FormGroup({
			firstName: new FormControl('', [
				Validators.required,
				Validators.minLength(3),
			]),
			lastName: new FormControl('', [
				Validators.required,
				Validators.minLength(3),
			]),
			// userName: new FormControl('', [
			// 	Validators.required,
			// 	Validators.minLength(3),
			// ]),
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(6),
			]),
		});
	}

	// Using Supabase
	register(): void {
		console.log(this.formGroup.value);
		const fullName = `${this.formGroup.value.firstName} ${this.formGroup.value.lastName}`;

		if (this.formGroup.invalid) {
			return;
		}

		this.authService
			.signUp(
				fullName,
				this.formGroup.value.email,
				this.formGroup.value.password
			)
			.then((data: any) => {
				console.log(data);
				this.formGroup.reset();
				this.router.navigate(['/login']);

				this.messageService.add({
					severity: 'success',
					summary: 'Success',
					detail: 'Por favor verifica tu correo electrónico para activar tu cuenta.',
					life: 8000,
				});
			})
			.catch((error: any) => {
				this.messageService.add({
					severity: 'error',
					summary: 'Error',
					detail: error.message,
					life: 3000,
				});
			});
	}

	goToLogin(): void {
		this.router.navigate(['/login']);
	}

	//! Using Express.js
	// register(): void {
	// 	console.log(this.formGroup.value);
	// 	this.authService.register(this.formGroup.value).subscribe({
	// 		next: (data: any) => {
	// 			alert('User created successfully');
	// 			this.formGroup.reset();
	// 			this.router.navigate(['login']);
	// 		},
	// 		error: (error: any) => {
	// 			console.error(error);
	// 		},
	// 	});
	// }
}
