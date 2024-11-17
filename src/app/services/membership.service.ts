import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Membership } from '../models/membership';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  url = `${environment.gymSoftApi}/api/membership`;

  constructor(private http: HttpClient) { }

  getMemberships(): Observable<Membership[]> {
    return this.http.get<Membership[]>(`${this.url}/all`);
  }

}
