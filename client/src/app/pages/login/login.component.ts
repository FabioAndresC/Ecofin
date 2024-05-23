import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
	selector: 'app-login',
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
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export default class LoginComponent implements OnInit {
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
			email: new FormControl('', [
				Validators.required,
				Validators.minLength(3),
			]),
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(6),
			]),
		});
	}

	login(): void {
		this.authService
			.signIn(this.formGroup.value.email, this.formGroup.value.password)
			.then((res) => {
				if (res.error) {
					this.messageService.add({
						severity: 'error',
						summary: 'Error',
						detail: res.error.message,
						life: 3000,
					});
					return;
				} else {
					this.messageService.add({
						severity: 'success',
						summary: 'Success',
						detail: 'Logged in successfully',
						life: 3000,
					});

					setTimeout(() => {
						this.router.navigate(['app/dashboard']);
					}, 1350);
				}
			});
	}
}
