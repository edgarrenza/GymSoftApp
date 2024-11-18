import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateMembership, Membership, UpdateMembership } from '../models/membership';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  url = `${environment.gymSoftApi}/api/membership`;

  constructor(private http: HttpClient) { }

  getMembershipById(membershipId: number): Observable<Membership> {
    return this.http.get<Membership>(`${this.url}/one/${membershipId}`);
  }

  getMemberships(): Observable<Membership[]> {
    return this.http.get<Membership[]>(`${this.url}/all`);
  }

  creareMembership(createMembership: CreateMembership): Observable<Membership> {
    return this.http.post<Membership>(this.url, createMembership);
  }

  deleteMembership(membershipId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${membershipId}`);
  }

  updateMembership(membershipId: number, updateMembership: UpdateMembership): Observable<Membership> {
    return this.http.put<Membership>(`${this.url}/update/${membershipId}`, updateMembership);
  }

}
