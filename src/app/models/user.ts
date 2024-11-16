export interface User {
    userId: number,
    username: string,
    password: string,
    role: string,
    enabled: boolean,
    createdAt?: string,
    updatedAt?: string
}

export type CreateUser = Pick<User, 'username' | 'password' | 'role' | 'enabled'>;
export type UpdateUser = Pick<User, 'username' | 'password' | 'role' | 'enabled'>;