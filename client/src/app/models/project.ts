export interface Project {
	project_id: number ;
	project_name: string;
	project_description: string;
	project_location?: string;
	required_budget: number; // numeric(15, 2)
	budget_description?: string;
	infrastructure_type?: string;
	project_risks?: string[];
	project_goals?: string[];
	amount_raised: number; // numeric(15, 2)
	user_id: string; // uuid
	project_image?: string;
	document_url?: string;
	created_at?: string; // timestamp
}
