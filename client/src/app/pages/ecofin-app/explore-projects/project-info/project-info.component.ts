import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
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
import { EditorModule } from 'primeng/editor';
import { ToastModule } from 'primeng/toast';
import { ProjectUpdateService } from '../../../../services/project-updates.service';
import { UpdateCommentService } from '../../../../services/update-comment.service';
import { AuthService } from '../../../../services/auth.service';
import { ProjectActivityService } from '../../../../services/project-activities.service';
import { AiService } from '../../../../services/ai.service';
import { ProjectReportService } from '../../../../services/project-reports.service';
import { Project } from '../../../../models/project';

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
		EditorModule,
		ToastModule,
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		RouterModule,
	],
	providers: [MessageService],
	templateUrl: './project-info.component.html',
	styleUrl: './project-info.component.scss',
})
export class ProjectInfoComponent implements OnInit {
	project: Project = {} as Project;
	dialogVisible: boolean = false;
	userSession: any;
	donationForm: FormGroup = new FormGroup({});

	// Forum methods
	createUpdateDialogVisible: boolean = false;
	updates: any[] = [];
	newUpdate = { title: '', description: '' };
	newComment = '';
	isCreator: boolean = false;

	// Activities methods
	createActivityDialogVisible: boolean = false;
	activities: any[] = [];
	newActivity = { amount_spent: 0, description: '' };
	totalAmountSpent: number = 0;

	showReportDialog: boolean = false;
	reasonForReport: string = '';
	projectAlreadyReported: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private projectService: ProjectService,
		private donationService: DonationService,
		private messageService: MessageService,
		private projectUpdateService: ProjectUpdateService,
		private updateCommentService: UpdateCommentService,
		private authService: AuthService,
		private projectActivityService: ProjectActivityService,
		private aiService: AiService,
		private projectReportService: ProjectReportService
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

			// Getting Updates of the project
			this.loadUpdates();

			// Getting Activities of the project
			this.getProjectActivities();
		});

		if (this.project) {
		}

		this.projectReportService
			.getReportsByUser(this.userSession.id)
			.then((reports) => {
				if (reports.length > 0) {
					this.projectAlreadyReported = true;
				}
			});
	}

	showPaymentDialog() {
		this.dialogVisible = true;
	}

	hidePaymentDialog() {
		this.dialogVisible = false;
	}

	goBack(): void {
		window.history.back();
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

	//! PROJECT ACTIVITIES METHODS
	showCreateActivityDialog() {
		this.createActivityDialogVisible = true;
	}
	hideCreateActivityDialog() {
		this.createActivityDialogVisible = false;
	}

	async getProjectActivities() {
		try {
			this.activities =
				await this.projectActivityService.getActivitiesByProject(
					this.project.project_id
				);

			// Calculate total amount spent
			this.activities.map((value: any) => {
				this.totalAmountSpent += value.amount_spent;
			});
		} catch (error) {
			console.error('Error fetching project activities:', error);
		}
	}

	async addActivity() {
		// Getting user_profile
		const userProfile: any = await this.authService.getUserProfile(
			this.userSession.id
		);
		const fullName = userProfile.data[0].full_name;

		// If the amount spent is greater than the amount raised, show an error message
		if (this.newActivity.amount_spent > this.project.amount_raised) {
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: 'El monto gastado es mayor al monto recaudado',
				life: 3000,
			});
			return;
		}

		let validation: string = await this.aiService.validateActivity(
			this.project.project_name,
			this.project.project_description,
			this.newActivity.amount_spent,
			this.newActivity.description
		);

		// Clean validation text
		validation = validation.replace(/<[^>]*>?/gm, '');

		// Delete the `` from the string
		validation = validation.replace(/`/g, '');

		// Convert to json
		const validationObj: any = JSON.parse(validation);

		if (validationObj.value === false) {
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: validationObj.explanation,
				life: 8000,
			});
			return;
		}

		try {
			const newActivity =
				await this.projectActivityService.createActivity(
					this.project.project_id,
					this.userSession.id,
					fullName,
					this.newActivity.amount_spent,
					this.newActivity.description
				);
			this.activities.push(newActivity);
		} catch (error) {
			console.error('Error creating activity:', error);
		}
	}

	//! FORO METHODS
	showCreateUpdateDialog() {
		this.createUpdateDialogVisible = true;
	}

	hideCreateUpdateDialog() {
		this.createUpdateDialogVisible = false;
	}

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

		// Getting the creator of each update
		let creator: any = await this.authService.getUserProfile(
			this.project.user_id
		);
		creator = creator.data[0].full_name;
		for (let update of this.updates) {
			update.creator = creator;
		}
	}

	async createUpdate() {
		await this.projectUpdateService.createUpdate(
			this.project.project_id,
			this.userSession.id,
			this.newUpdate.title,
			this.newUpdate.description
		);
		this.newUpdate = { title: '', description: '' };
		this.loadUpdates();
	}

	async createComment(updateId: number) {
		const userProfile: any = await this.authService.getUserProfile(
			this.userSession.id
		);

		await this.updateCommentService.createComment(
			updateId,
			this.userSession.id,
			userProfile.data[0].full_name,
			this.newComment
		);
		this.newComment = '';
		this.loadUpdates();
	}

	onReportProject(): void {
		this.projectReportService
			.createReport(
				this.project.project_id,
				this.userSession.id,
				this.reasonForReport
			)
			.then(() => {
				this.messageService.add({
					severity: 'info',
					summary: 'Reportar proyecto',
					detail: 'El proyecto ha sido reportado',
					life: 3000,
				});
				this.onHideReportDialog();
			});
	}

	onShowReportDialog() {
		this.showReportDialog = true;
	}

	onHideReportDialog() {
		this.showReportDialog = false;
	}
}
