export enum Role {
  ADMIN = "admin",
  MANAGER = "manager",
  MEMBER = "member",
}

export enum Country {
  INDIA = "India",
  AMERICA = "America",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  country?: Country;
}

export interface AuthResponse {
  success: boolean;
  data: {
    access_token: string;
    user: User;
  };
}
