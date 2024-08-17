export type UpdateUser = {
  firstName?: string;
  lastName?: string;
  password?: string;
  dateOfBirth?: string;
  address?: string;
  number?: string;
  image?: string;
  isVerified?: boolean;
};


export type User = {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  address: string;
  number: string;
  image: string | null;
  isVerified: boolean;
  type: string;
}