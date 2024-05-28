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
import { EditorModule } from 'primeng/editor';
import { ToastModule } from 'primeng/toast';
import { ProjectUpdateService } from '../../../../services/project-updates.service';
import { UpdateCommentService } from '../../../../services/update-comment.service';
import { AuthService } from '../../../../services/auth.service';

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
	createUpdateDialogVisible: boolean = false;
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
		private updateCommentService: UpdateCommentService,
		private authService: AuthService
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

	// FORO METHODS
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
}
