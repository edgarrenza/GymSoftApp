import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateEmployee, Employee, UpdateEmployee } from '../models/employee';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    url = `${environment.gymSoftApi}/api/employee`;

    constructor(private http: HttpClient) { }

    getEmployees(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/all`);
    }

    creareEmployee(CreateEmployee: CreateEmployee): Observable<Employee> {
      return this.http.post<Employee>(this.url, CreateEmployee);
    }

    deleteEmployee(membershipId: number): Observable<void> {
      return this.http.delete<void>(`${this.url}/delete/${membershipId}`);
    }

    updateEmployee(membershipId: number, UpdateEmployee: UpdateEmployee): Observable<Employee> {
      return this.http.put<Employee>(`${this.url}/update/${membershipId}`, UpdateEmployee);
    }
}
