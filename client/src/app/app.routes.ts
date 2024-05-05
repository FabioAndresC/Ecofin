import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'login',
		loadComponent: () => import('./pages/login/login.component'),
	},
	{
		path: 'register',
		loadComponent: () => import('./pages/register/register.component'),
	},
];
