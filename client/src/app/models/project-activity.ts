export interface ProjectActivity {
	id: number;
	project_id: number;
	user_id: string; // uuid
	full_name: string;
	amount_spent: number; // numeric(15, 2)
	description?: string;
	created_at?: string; // timestamp
}
