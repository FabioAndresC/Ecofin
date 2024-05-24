import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { Router, RouterModule } from '@angular/router';
import { DonationService } from '../../../services/donation.service';

@Component({
	selector: 'app-my-donations',
	standalone: true,
	imports: [
		CardModule,
		ButtonModule,
		CommonModule,
		ProgressBarModule,
		RouterModule,
	],
	templateUrl: './my-donations.component.html',
	styleUrl: './my-donations.component.scss',
})
export class MyDonationsComponent implements OnInit {
	donations: any;
	projectsDonated: any;
	userSession: any;

	constructor(
		private projectService: ProjectService,
		private donationService: DonationService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.getProjects();
	}

	async getProjects() {
		const session = localStorage.getItem('session') as any;
		this.userSession = JSON.parse(session);

		await this.donationService
			.getDonationsByUser(this.userSession.id)
			.then((donations) => {
				this.donations = donations;
			});

		await this.projectService.getProjects().then((projects) => {
			this.projectsDonated = projects.filter((project: any) => {
				return this.donations.some(
					(donation: any) =>
						donation.project_id === project.project_id
				);
			});
		});
	}

	goToProjectDetails(id: string) {
		this.router.navigate(['app/project-details/', id]);
	}
}
