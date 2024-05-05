import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [ButtonModule, CommonModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent {
	constructor(private router: Router) {}

	goToSignIn(): void {
		this.router.navigate(['/login']);
	}

  goToRegister(): void {
    this.router.navigate(['/register'])
  }
}
