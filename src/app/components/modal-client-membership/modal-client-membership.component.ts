import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular/standalone';
import { forkJoin } from 'rxjs';
import { Client } from 'src/app/models/client';
import { ClientMembership } from 'src/app/models/client-membership';
import { Membership } from 'src/app/models/membership';
import { ClientMembershipService } from 'src/app/services/client-membership.service';
import { ClientService } from 'src/app/services/client.service';
import { MembershipService } from 'src/app/services/membership.service';

@Component({
  selector: 'app-modal-client-membership',
  templateUrl: './modal-client-membership.component.html',
  styleUrls: ['./modal-client-membership.component.scss'],
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, IonicModule ],
})
export class ModalClientMembershipComponent  implements OnInit {

  @Input() clientMembershipId: number | null = null;
  form: FormGroup;
  title: string = '';
  clients: Client[] = [];
  memberships: Membership[] = [];

  //Toast
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private alertController: AlertController,
    private clientService: ClientService,
    private membershipService: MembershipService,
    private clientMembershipService: ClientMembershipService, 
  ) {}

  ngOnInit() {
    if(this.clientMembershipId){
      //Update
      this.title = 'Actualizar Client Membership';
      this.clientMembershipService.getClientMembershipById(this.clientMembershipId)
        .subscribe({
          next: (clientMembership) => {
            this.initFormUpdate(clientMembership);
          },
          error: (error: any) => {
            this.presentToast('Error al obtener el ClientMembership', 'danger');
            console.log(error);
          }
        })
    } else {
      //Create
      this.title = 'Crear Client Membership';
      this.getClientsAndMemberships();
      this.initFormCreate();
    }

  }

  initFormCreate(){
    this.form = this.fb.group({
      clientId: [null, Validators.required],
      membershipId: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      remainingDays: ['', Validators.required],
      quantity: ['', Validators.required],
      cost: ['', Validators.required],
      price: ['', Validators.required],
    })
  }

  initFormUpdate(clientMembership: ClientMembership){
    this.form = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      remainingDays: ['', Validators.required],
      quantity: ['', Validators.required],
      cost: ['', Validators.required],
      price: ['', Validators.required],
      enabled: ['', Validators.required],
    });
    this.form.patchValue(clientMembership);
  }

  getClientsAndMemberships(){
    forkJoin([
      this.clientService.getClients(),
      this.membershipService.getMemberships(),
    ]).subscribe({
      next: ([clients, memberships]) => {
        this.clients = clients;
        this.memberships = memberships;
      },
      error: (error: any) => {
        this.presentToast('Error al obtener los Clients y Memberships', 'danger');
        console.log('error', error);
      }
    });
  }
  
  create(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      this.presentToast('Error en el Formulario', 'danger');
      return;
    }
    
    this.clientMembershipService.createClientMembership(this.form.value)
      .subscribe({
        next: () => {
          this.form.reset();
          this.presentToast('Se ha creado el ClientMembership exitosamente', 'success');
          this.closeModal(true)
        },
        error: (error: any) => {
          this.presentToast('Error al crear el ClientMembership', 'danger');
          console.log(error);
        }
      });
  }

  update(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      this.presentToast('Error en el Formulario', 'danger');
      return;
    }
    
    this.clientMembershipService.updateClientMembership(this.clientMembershipId!, this.form.value)
      .subscribe({
        next: () => {
          this.form.reset();
          this.presentToast('Se ha actualizado el ClientMembership exitosamente', 'success');
          this.closeModal(true)
        },
        error: (error: any) => {
          this.presentToast('Error al actualizar el ClientMembership', 'danger');
          console.log(error);
        }
      });
  }

  presentToast(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  closeModal(data?: boolean) {
    this.modalController.dismiss(data ? data : false); // Cerrar el modal
  }

}
