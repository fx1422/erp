import request from '@/utils/request';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    realName: string;
  };
}

export function login(data: LoginParams): Promise<LoginResult> {
  return request.post('/auth/login', data);
}

export function getUserList() {
  return request.get('/system/users');
}

export function createUser(data: any) {
  return request.post('/system/users', data);
}

export function updateUser(id: string, data: any) {
  return request.patch(`/system/users/${id}`, data);
}

export function deleteUser(id: string) {
  return request.delete(`/system/users/${id}`);
}

export function getRoleList() {
  return request.get('/system/roles');
}

export function createRole(data: any) {
  return request.post('/system/roles', data);
}

export function updateRole(id: string, data: any) {
  return request.patch(`/system/roles/${id}`, data);
}

export function deleteRole(id: string) {
  return request.delete(`/system/roles/${id}`);
}
