import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/ecofin-app/dashboard/dashboard.component';
import { ManageProjectsComponent } from './pages/ecofin-app/manage-projects/manage-projects.component';
import { EcofinAppComponent } from './pages/ecofin-app/ecofin-app.component';
import { authGuard } from './auth.guard';
import { ExploreProjectsComponent } from './pages/ecofin-app/explore-projects/explore-projects.component';
import { MyDonationsComponent } from './pages/ecofin-app/my-donations/my-donations.component';
import { ProjectInfoComponent } from './pages/ecofin-app/explore-projects/project-info/project-info.component';
import { MyProfileComponent } from './pages/ecofin-app/my-profile/my-profile.component';

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
		canActivate: [authGuard],
		children: [
			{
				path: 'dashboard',
				component: DashboardComponent,
			},
			{
				path: 'manage-projects',
				component: ManageProjectsComponent,
			},
			{
				path: 'explore-projects',
				component: ExploreProjectsComponent,
			},
			{
				path: 'my-donations',
				component: MyDonationsComponent,
			},
			{
				path: 'my-profile',
				component: MyProfileComponent,
			},
			{
				path: 'project-details/:id',
				component: ProjectInfoComponent,
			},
		],
	},
];
