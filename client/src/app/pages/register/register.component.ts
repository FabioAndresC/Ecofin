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
	],
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export default class RegisterComponent implements OnInit {
	formGroup: FormGroup = new FormGroup({});

	constructor(private authService: AuthService, private router: Router) {}

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
			})
			.catch((error: any) => {
				console.error(error);
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
