import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  url = `${environment.gymSoftApi}/api/membership`;

  constructor(private http: HttpClient) { }

  getMemberships(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/all`);
  }

}
