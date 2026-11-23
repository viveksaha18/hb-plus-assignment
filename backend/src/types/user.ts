export type User = {
  id: string;
  google_id: string;
  name: string;
  email: string;
  profile_picture: string | null;
  role: string;
  created_at: Date;
  updated_at: Date;
};
