import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { Router, RouterModule } from '@angular/router';

@Component({
	selector: 'app-explore-projects',
	standalone: true,
	imports: [
		CardModule,
		ButtonModule,
		CommonModule,
		ProgressBarModule,
		RouterModule,
	],
	templateUrl: './explore-projects.component.html',
	styleUrl: './explore-projects.component.scss',
})
export class ExploreProjectsComponent implements OnInit {
	allProjects: any;

	constructor(
		private projectService: ProjectService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.getProjects();
	}

	async getProjects() {
		await this.projectService.getProjects().then((projects) => {
			this.allProjects = projects;
		});
		console.log(this.allProjects);
	}

	goToProjectDetails(id: string) {
		this.router.navigate(['app/project-details/', id]);
	}
}
