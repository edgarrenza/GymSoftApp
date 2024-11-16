export interface Employee {
    employeeId: number,
    firstName: string,
    lastName: string,
    employeeType: string,
    address: string,
    email: string,
    phone: string,
    enabled: boolean,
    createdAt: string,
    updatedAt: string,
    userId: number
}

export type CreateEmployee = Pick<Employee, 'firstName' | 'lastName' | 'employeeType' | 'address' | 'email' | 'phone' | 'userId'>;
export type UpdateEmployee = Pick<Employee, 'firstName' | 'lastName' | 'employeeType' | 'address' | 'email' | 'phone' | 'userId'>;