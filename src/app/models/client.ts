export interface Client {
    clientId: number,
    firstName: string,
    lastName: string,
    address: string,
    email: string,
    phone: string,
    enabled: boolean,
    createdAt: string,
    updatedAt: string
}

export type CreateClient = Pick<Client, 'firstName' | 'lastName' | 'address' | 'email' | 'phone' >;
export type UpdateClient = Pick<Client, 'firstName' | 'lastName' | 'address' | 'email' | 'phone' >;