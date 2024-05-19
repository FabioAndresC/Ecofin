import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/ecofin-app/dashboard/dashboard.component';
import { ManageProjectsComponent } from './pages/ecofin-app/manage-projects/manage-projects.component';
import { EcofinAppComponent } from './pages/ecofin-app/ecofin-app.component';

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
	},
	{
		path: 'login',
		loadComponent: () => import('./pages/login/login.component'),
	},
	{
		path: 'register',
		loadComponent: () => import('./pages/register/register.component'),
	},
	{
		path: 'app',
		component: EcofinAppComponent,
		children: [
			{
				path: 'dashboard',
				component: DashboardComponent,
			},
		],
	},
];
