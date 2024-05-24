import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProjectService } from '../../../../services/project.service';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { DonationService } from '../../../../services/donation.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProjectUpdateService } from '../../../../services/project-updates.service';
import { UpdateCommentService } from '../../../../services/update-comment.service';

@Component({
	selector: 'app-project-info',
	standalone: true,
	imports: [
		CommonModule,
		TabViewModule,
		ButtonModule,
		ProgressBarModule,
		TagModule,
		DialogModule,
		InputTextModule,
		InputMaskModule,
		InputNumberModule,
		ToastModule,
		CommonModule,
		ReactiveFormsModule,
		FormsModule
	],
	providers: [MessageService],
	templateUrl: './project-info.component.html',
	styleUrl: './project-info.component.scss',
})
export class ProjectInfoComponent implements OnInit {
	project: any;
	dialogVisible: boolean = false;
	userSession: any;
	donationForm: FormGroup = new FormGroup({});

	// Forum methods
	updates: any[] = [];
	newUpdate = { title: '', description: '' };
	newComment = '';
	isCreator: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private projectService: ProjectService,
		private donationService: DonationService,
		private messageService: MessageService,
		private projectUpdateService: ProjectUpdateService,
		private updateCommentService: UpdateCommentService
	) {}

	ngOnInit(): void {
		const session = localStorage.getItem('session') as any;
		this.userSession = JSON.parse(session);

		this.setDonationForm();
		this.getProjectDetails();
	}

	setDonationForm() {
		this.donationForm = new FormGroup({
			amount: new FormControl('', Validators.required),
		});
	}

	getProjectDetails() {
		const id = this.route.snapshot.params['id'];

		this.projectService.getProjectById(id).then((project) => {
			this.project = project;

			console.log(this.project.user_id, this.userSession.id);
			this.isCreator = this.project.user_id === this.userSession.id;

			this.loadUpdates();
		});

		if (this.project) {
		}
	}

	showPaymentDialog() {
		this.dialogVisible = true;
	}

	hidePaymentDialog() {
		this.dialogVisible = false;
	}

	async donate(): Promise<void> {
		const projectId = this.project.project_id;
		const amount = this.donationForm.value.amount;

		await this.donationService
			.createDonation(this.userSession.id, projectId, amount)
			.then(() => {
				this.projectService
					.updateAmountRaised(projectId, amount)
					.then(() => {
						this.messageService.add({
							severity: 'success',
							summary: 'Success',
							detail: 'Gracias por tu donación!',
							life: 3000,
						});
					});

				this.getProjectDetails();
			});

		this.hidePaymentDialog();
	}

	// Foro methods
	async loadUpdates() {
		this.updates = await this.projectUpdateService.getUpdatesByProject(
			this.project.project_id
		);
		for (let update of this.updates) {
			update.comments =
				await this.updateCommentService.getCommentsByUpdate(
					update.update_id
				);
		}
		console.log(this.updates);
		console.log(this.updates[0].comments);
	}

	async createUpdate() {
		await this.projectUpdateService.createUpdate(
			this.project.project_id,
			this.newUpdate.title,
			this.newUpdate.description
		);
		this.newUpdate = { title: '', description: '' };
		this.loadUpdates();
	}

	async createComment(updateId: number) {
		await this.updateCommentService.createComment(
			updateId,
			this.userSession.id,
			this.newComment
		);
		this.newComment = '';
		this.loadUpdates();
	}
}
