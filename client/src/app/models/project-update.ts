export interface ProjectUpdate {
	update_id: number;
	project_id: number;
	creator_id: string; // uuid
	title: string;
	description?: string;
	created_at?: string; // timestamp
	updated_at?: string; // timestamp
}
