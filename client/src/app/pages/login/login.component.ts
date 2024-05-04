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
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export default class LoginComponent implements OnInit {
	formGroup: FormGroup = new FormGroup({});

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
}
