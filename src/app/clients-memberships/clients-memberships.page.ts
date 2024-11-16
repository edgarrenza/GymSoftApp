import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  AlertController
 } from '@ionic/angular/standalone';
import { ClientMembership } from '../models/client-membership';
import { ClientMembershipService } from '../services/client-membership.service';
import { ClientService } from '../services/client.service';
import { MembershipService } from '../services/membership.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-clients-memberships',
  templateUrl: './clients-memberships.page.html',
  styleUrls: ['./clients-memberships.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule
  ]
})
export class ClientsMembershipsPage implements OnInit {

  clientsMemberships: ClientMembership[] = [];
  form: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private clientService: ClientService,
    private membershipService: MembershipService,
    private clientMembershipService: ClientMembershipService, 
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  initForm(){

  }

  getClientsAndMemberships(){
    forkJoin([
      this.clientService.getClients(),
      this.membershipService.getMemberships(),
    ]).subscribe({
      next: ([clients, memberships]) => {
        console.log({ clients, memberships })
      },
      error: (error: any) => {
        console.log('error', error);
      }
    })
  }

  getCliensMemberships(){

  }

}
