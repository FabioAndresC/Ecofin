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
	],
	templateUrl: './manage-projects.component.html',
	styleUrl: './manage-projects.component.scss',
})
export class ManageProjectsComponent implements OnInit {
	dialogVisible: boolean = false;
	projectForm: FormGroup = new FormGroup({});
	userSession: any;
	allProjects: any;

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
		{
			name: 'Tratamiento de residuos sólidos y aguas servidas',
			code: 'INF005',
		},
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

	metasOds = [
		{ name: 'Fin de la Pobreza', code: 'ODS1' },
		{ name: 'Hambre Cero', code: 'ODS2' },
		{ name: 'Salud y Bienestar', code: 'ODS3' },
		{ name: 'Educación de Calidad', code: 'ODS4' },
		{ name: 'Igualdad de Género', code: 'ODS5' },
		{ name: 'Agua Limpia y Saneamiento', code: 'ODS6' },
		{ name: 'Energía Asequible y No Contaminante', code: 'ODS7' },
		{ name: 'Trabajo Decente y Crecimiento Económico', code: 'ODS8' },
		{ name: 'Industria, Innovación e Infraestructura', code: 'ODS9' },
		{ name: 'Reducción de las Desigualdades', code: 'ODS10' },
		{ name: 'Ciudades y Comunidades Sostenibles', code: 'ODS11' },
		{ name: 'Producción y Consumo Responsables', code: 'ODS12' },
		{ name: 'Acción por el Clima', code: 'ODS13' },
		{ name: 'Vida Submarina', code: 'ODS14' },
		{ name: 'Vida de Ecosistemas Terrestres', code: 'ODS15' },
		{ name: 'Paz, Justicia e Instituciones Sólidas', code: 'ODS16' },
		{ name: 'Alianzas para Lograr los Objetivos', code: 'ODS17' },
	];

	constructor(
		private router: Router,
		private projectService: ProjectService
	) {}

	async ngOnInit(): Promise<void> {
		this.setupForm();

		await this.getUserProjects();
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
			project_location: new FormControl('', Validators.required),
			required_budget: new FormControl('', Validators.required),
			budget_description: new FormControl('', Validators.required),
			infrastructure_type: new FormControl('', Validators.required),
			project_risks: new FormControl('', Validators.required),
			project_goals: new FormControl('', Validators.required),
			user_id: new FormControl(this.userSession.id),
			project_image: new FormControl(''),
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

	async createProject(): Promise<void> {
		if (this.projectForm.invalid) {
			console.log('Invalid form');
			return;
		}

		console.log(this.projectForm.value);

		// Update project image url
		const imageUrl = await this.projectService.uploadProjectImage(
			this.projectForm.value.project_image
		);
		this.projectForm.patchValue({
			project_image: imageUrl,
		});

		this.projectService.createProject(this.projectForm.value).then(() => {
			this.dialogVisible = false;
		});
		this.getUserProjects();
	}
}
