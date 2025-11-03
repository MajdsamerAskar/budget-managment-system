import api from "./axios";

export interface User {
  id: number;
  name: string;
  email: string;
}

export async function getUsers() {
  const response = await api.get<User[]>("/users");
  return response.data;
}
