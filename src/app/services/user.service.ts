import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUser, UpdateUser, User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = `${environment.gymSoftApi}/api/user`;

  constructor(private httpClient:HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.url}/all`);
  }

  createUser(createUser: CreateUser): Observable<User> {
    return this.httpClient.post<User>(this.url, createUser);
  }

  deleteUser(userId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/delete/${userId}`);
  }

  updateUser(userId: number, updateUser: UpdateUser): Observable<User> {
    return this.httpClient.put<User>(`${this.url}/update/${userId}`, updateUser);
  }
}
