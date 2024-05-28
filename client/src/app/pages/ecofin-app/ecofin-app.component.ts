import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'app-ecofin-app',
	standalone: true,
	imports: [CommonModule, RouterModule, ButtonModule],
	templateUrl: './ecofin-app.component.html',
	styleUrl: './ecofin-app.component.scss',
})
export class EcofinAppComponent implements OnInit {
	constructor(private router: Router, private authService: AuthService) {}

	sidebarItems = [
		// {
		// 	name: 'Dashboard',
		// 	icon: 'pi-home',
		// 	active: true,
		// 	route: '/app/dashboard',
		// },
		{
			name: 'Mis proyectos',
			icon: 'pi-briefcase',
			active: false,
			route: '/app/manage-projects',
		},
		{
			name: 'Mis donaciones',
			icon: 'pi-chart-bar',
			active: false,
			route: '/app/my-donations',
		},
		{
			name: 'Explorar proyectos',
			icon: 'pi-search',
			active: false,
			route: '/app/explore-projects',
		},
		{
			name: 'Mi perfil',
			icon: 'pi-user',
			active: false,
			route: '/app/my-profile',
		},
	];

	ngOnInit(): void {
		this.selectItem(this.sidebarItems[0]);
	}

	selectItem(item: any) {
		this.sidebarItems.forEach((i) => (i.active = false));
		item.active = true;

		this.router.navigate([item.route]);
	}

	async logOut(): Promise<void> {
		this.authService
			.signOut()
			.then(() => {
				this.router.navigate(['/login']);
			})
			.catch((error: any) => {
				console.error(error);
			});
	}
}
