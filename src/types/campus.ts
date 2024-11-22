export type Campus = {
  id: number;
  name: string;
  address: string;
  token: string;
  icon: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type CreateCampusRequest = {
  name: string;
  address: string;
  icon: File | null;
};

export type UpdateCampusRequest = {
  name: string;
  address: string;
  icon: File | null | undefined;
};
