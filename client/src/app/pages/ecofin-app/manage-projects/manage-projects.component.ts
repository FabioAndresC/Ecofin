import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProjectService } from '../../../services/project.service';
import {
	FileUploadEvent,
	FileUploadModule,
	UploadEvent,
} from 'primeng/fileupload';
import { OpenAI } from '@langchain/openai';
import { EditorModule } from 'primeng/editor';
import { AiService } from '../../../services/ai.service';
import { SpeedDialModule } from 'primeng/speeddial';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { WebScrapingService } from '../../../services/web-scraping.service';

@Component({
	selector: 'app-manage-projects',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule,
		ButtonModule,
		CardModule,
		DialogModule,
		InputTextModule,
		DropdownModule,
		InputNumberModule,
		InputTextareaModule,
		MultiSelectModule,
		FileUploadModule,
		EditorModule,
		SpeedDialModule,
		ToastModule,
	],
	providers: [MessageService],
	templateUrl: './manage-projects.component.html',
	styleUrl: './manage-projects.component.scss',
})
export class ManageProjectsComponent implements OnInit {
	dialogVisible: boolean = false;
	projectForm: FormGroup = new FormGroup({});
	userSession: any;
	allProjects: any;

	manageProjectId: number = 0;

	santaCruzProvinces = [
		{ name: 'Andrés Ibáñez', code: 'SC-01' },
		{ name: 'Ángel Sandóval', code: 'SC-02' },
		{ name: 'Chiquitos', code: 'SC-03' },
		{ name: 'Cordillera', code: 'SC-04' },
		{ name: 'Florida', code: 'SC-05' },
		{ name: 'Germán Busch', code: 'SC-06' },
		{ name: 'Guarayos', code: 'SC-07' },
		{ name: 'Ichilo', code: 'SC-08' },
		{ name: 'Manuel M. Caballero', code: 'SC-09' },
		{ name: 'Ñuflo de Chávez', code: 'SC-10' },
		{ name: 'Obispo Santiestevan', code: 'SC-11' },
		{ name: 'Sara', code: 'SC-12' },
		{ name: 'Vallegrande', code: 'SC-13' },
		{ name: 'Velasco', code: 'SC-14' },
		{ name: 'Warnes', code: 'SC-15' },
	];

	infrastructureTypes = [
		{ name: 'Carreteras, calles y vías', code: 'INF001' },
		{ name: 'Puentes', code: 'INF002' },
		{
			name: 'Transporte público, aeropuertos y vías aéreas',
			code: 'INF003',
		},
		{ name: 'Abastecimiento de agua y recursos', code: 'INF004' },
		// {
		// 	name: 'Tratamiento de residuos sólidos y aguas servidas',
		// 	code: 'INF005',
		// },
		{ name: 'Telecomunicaciones', code: 'INF006' },
		{ name: 'Generación y transmisión de energía', code: 'INF007' },
	];

	riesgosProyecto = [
		{
			name: 'Riesgo Financiero',
			code: 'R001',
		},
		{
			name: 'Riesgo Regulatorio',
			code: 'R002',
		},
		{
			name: 'Riesgo Ambiental',
			code: 'R003',
		},
		{
			name: 'Riesgo Social',
			code: 'R004',
		},
		{
			name: 'Riesgo Tecnológico',
			code: 'R005',
		},
		{
			name: 'Riesgo Operacional',
			code: 'R006',
		},
		{
			name: 'Riesgo Político',
			code: 'R007',
		},
		{
			name: 'Riesgo de Mercado',
			code: 'R008',
		},
		{
			name: 'Riesgo de Salud y Seguridad',
			code: 'R009',
		},
		{
			name: 'Riesgo de Infraestructura',
			code: 'R010',
		},
	];

	metasOds: any = [
		// { name: 'Fin de la Pobreza', code: 'ODS1' },
		// { name: 'Hambre Cero', code: 'ODS2' },
		// { name: 'Salud y Bienestar', code: 'ODS3' },
		// { name: 'Educación de Calidad', code: 'ODS4' },
		// { name: 'Igualdad de Género', code: 'ODS5' },
		// { name: 'Agua Limpia y Saneamiento', code: 'ODS6' },
		// { name: 'Energía Asequible y No Contaminante', code: 'ODS7' },
		// { name: 'Trabajo Decente y Crecimiento Económico', code: 'ODS8' },
		// { name: 'Industria, Innovación e Infraestructura', code: 'ODS9' },
		// { name: 'Reducción de las Desigualdades', code: 'ODS10' },
		// { name: 'Ciudades y Comunidades Sostenibles', code: 'ODS11' },
		// { name: 'Producción y Consumo Responsables', code: 'ODS12' },
		// { name: 'Acción por el Clima', code: 'ODS13' },
		// { name: 'Vida Submarina', code: 'ODS14' },
		// { name: 'Vida de Ecosistemas Terrestres', code: 'ODS15' },
		// { name: 'Paz, Justicia e Instituciones Sólidas', code: 'ODS16' },
		// { name: 'Alianzas para Lograr los Objetivos', code: 'ODS17' },
	];

	speedDialActions = [
		{
			icon: 'pi pi-eye',
			tooltip: 'Ver proyecto',
			command: () => {
				this.router.navigate([
					'app/project-details/',
					this.manageProjectId,
				]);
			},
		},
		{
			icon: 'pi pi-trash',
			tooltip: 'Eliminar proyecto',
			command: () => {
				this.deleteProject();
			},
		},
	];

	constructor(
		private router: Router,
		private projectService: ProjectService,
		private aiService: AiService,
		private messageService: MessageService,
		private webScrapingService: WebScrapingService
	) {}

	async ngOnInit(): Promise<void> {
		this.setupForm();

		// Load ODS from web scraping
		await this.webScraping();

		await this.getUserProjects();
	}

	async webScraping(): Promise<void> {
		this.webScrapingService.updateOdsGoals();
		this.webScrapingService.getOdsGoals().then((data) => {
			data.forEach((item: any) => {
				this.metasOds.push({
					name: item.objetivo,
					code: item.id,
				});
			});

			// Sort metasOds array by code
			this.metasOds.sort((a: any, b: any) => {
				if (a.code < b.code) {
					return -1;
				}
				if (a.code > b.code) {
					return 1;
				}
				return 0;
			});
		});
	}

	async getUserProjects() {
		await this.projectService
			.getProjectByUserId(this.userSession.id)
			.then((projects) => {
				this.allProjects = projects;
			});
	}

	goToProjectDetails(id: string) {
		this.router.navigate(['app/project-details/', id]);
	}

	setupForm(): void {
		const session = localStorage.getItem('session') as any;
		this.userSession = JSON.parse(session);

		this.projectForm = new FormGroup({
			project_name: new FormControl('', Validators.required),
			project_description: new FormControl('', Validators.required),
			project_image: new FormControl(''),
			project_location: new FormControl('', Validators.required),
			infrastructure_type: new FormControl('', Validators.required),
			required_budget: new FormControl('', Validators.required),
			budget_description: new FormControl('', Validators.required),
			document_url: new FormControl(''),
			project_risks: new FormControl('', Validators.required),
			project_goals: new FormControl('', Validators.required),
			user_id: new FormControl(this.userSession.id),
			created_at: new FormControl(new Date().toISOString()),
		});
	}

	showDialog(): void {
		this.dialogVisible = true;
	}

	hideDialog(): void {
		this.dialogVisible = false;
	}

	onFileSelected(event: any): void {
		const file: File = event.currentFiles[0];
		this.projectForm.patchValue({
			project_image: file,
		});
		console.log(event);
	}

	onDocumentSelected(event: any): void {
		const file: File = event.currentFiles[0];
		this.projectForm.patchValue({
			document_url: file,
		});
		console.log(event);
	}

	async createProject(): Promise<void> {
		if (this.projectForm.invalid) {
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: 'Por favor, complete todos los campos',
				life: 3000,
			});
			return;
		}

		console.log(this.projectForm.value);

		// Update project image url
		const imageUrl = await this.projectService.uploadProjectImage(
			this.projectForm.value.project_image
		);

		// Update project pdf url
		const pdfUrl = await this.projectService.uploadDocument(
			this.projectForm.value.document_url
		);

		console.log('Image URL:', pdfUrl);

		this.projectForm.patchValue({
			project_image: imageUrl,
			document_url: pdfUrl,
		});

		this.projectService
			.createProject(this.projectForm.value)
			.then(() => {
				this.dialogVisible = false;
			})
			.then(() => {
				this.messageService.add({
					severity: 'success',
					summary: 'Proyecto creado',
					detail: 'El proyecto ha sido creado correctamente',
					life: 3000,
				});
				this.getUserProjects();
			});
	}

	async deleteProject(): Promise<void> {
		try {
			await this.projectService
				.deleteProject(this.manageProjectId)
				.then(() => {
					this.messageService.add({
						severity: 'success',
						summary: 'Proyecto eliminado',
						detail: 'El proyecto ha sido eliminado correctamente',
						life: 3000,
					});

					this.getUserProjects();
				});
		} catch (error) {
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: 'El proyecto no pudo ser eliminado porque tiene actividades asociadas',
				life: 3000,
			});
		}
	}

	onSpeedDialAction(action: any, projectId: number): void {
		this.manageProjectId = projectId;
	}

	async generateBudgetDescription(): Promise<void> {
		const name = this.projectForm.value.project_name;
		const description = this.projectForm.value.project_description;
		const infrastructure_type = this.projectForm.value.infrastructure_type;

		const res: any = await this.aiService.generateBudgetDescGoogle(
			name,
			description,
			infrastructure_type
		);

		// Update value in form and show it on the input
		this.projectForm.patchValue({
			budget_description: res,
		});
	}
}
