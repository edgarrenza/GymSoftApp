import { ClientMembership, CreateClientMembership, UpdateClientMembership } from './../models/client-membership';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientMembershipService {

  url = `${environment.gymSoftApi}/api/client-membership`;

  constructor(private http: HttpClient) { }

  getClientMembershipById(clientMembershipId: number): Observable<ClientMembership> {
    return this.http.get<ClientMembership>(`${this.url}/one/${clientMembershipId}`);
  }

  getClientsMemberships(): Observable<ClientMembership[]> {
    return this.http.get<ClientMembership[]>(`${this.url}/all`);
  }

  createClientMembership(createClientMembership: CreateClientMembership): Observable<ClientMembership> {
    return this.http.post<ClientMembership>(`${this.url}`, createClientMembership);
  }

  updateClientMembership(clientMembershipId: number, updateClientMembership: UpdateClientMembership): Observable<ClientMembership> {
    return this.http.put<ClientMembership>(`${this.url}/update/${clientMembershipId}`, updateClientMembership);
  }

  deleteClientMembership(clientMembershipId: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/delete/${clientMembershipId}`);
  }

}
