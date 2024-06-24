export interface Donation {
	donation_id: number;
	user_id: string; // uuid
	project_id: number;
	amount: number; // numeric(15, 2)
	donated_at?: string; // timestamp
}
