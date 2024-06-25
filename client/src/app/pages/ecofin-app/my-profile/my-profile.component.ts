import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from '../../../services/user-profile.service';

@Component({
	selector: 'app-my-profile',
	standalone: true,
	imports: [],
	templateUrl: './my-profile.component.html',
	styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent {
	userProfileForm: FormGroup;
	userId = 'user-uuid'; // Reemplazar con el ID del usuario actual

	constructor(
		private fb: FormBuilder,
		private userProfileService: UserProfileService
	) {
		this.userProfileForm = this.fb.group({
			full_name: ['', Validators.required],
		});
	}

	ngOnInit(): void {
		this.loadUserProfile();
	}

	async loadUserProfile() {
		const userProfile = await this.userProfileService.getUserProfile(
			this.userId
		);
		if (userProfile) {
			this.userProfileForm.patchValue(userProfile);
		}
	}

	async onSubmit() {
		if (this.userProfileForm.valid) {
			const userProfile: any = {
				id: this.userId,
				full_name: this.userProfileForm.get('full_name')?.value,
			};
			const result = await this.userProfileService.upsertUserProfile(
				userProfile
			);
			if (result) {
				alert('Perfil de usuario actualizado correctamente');
			} else {
				alert('Hubo un error al actualizar el perfil de usuario');
			}
		}
	}
}
