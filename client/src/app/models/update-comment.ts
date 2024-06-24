export interface UpdateComment {
	comment_id: number;
	update_id: number;
	user_id: string; // uuid
	full_name?: string;
	comment: string;
	created_at?: string; // timestamp
}
