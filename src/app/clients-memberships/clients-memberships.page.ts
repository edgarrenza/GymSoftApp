import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController} from '@ionic/angular/standalone';
import { IonicModule, ModalController } from '@ionic/angular';
import { ClientMembership } from '../models/client-membership';
import { ClientMembershipService } from '../services/client-membership.service';
import { ModalClientMembershipComponent } from '../components/modal-client-membership/modal-client-membership.component';

@Component({
  selector: 'app-clients-memberships',
  templateUrl: './clients-memberships.page.html',
  styleUrls: ['./clients-memberships.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule,
  ]
})
export class ClientsMembershipsPage implements OnInit {

  clientsMemberships: ClientMembership[] = [];

  //Toast
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  constructor(
    private clientMembershipService: ClientMembershipService, 
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getCliensMemberships();
  }

  getCliensMemberships(){
    this.clientMembershipService.getClientsMemberships().subscribe({
      next: (clientsMemberships) => {
        this.clientsMemberships = clientsMemberships;
      },
      error: (error: any) => {
        this.presentToast('Error al obtener los ClientsMemberships', 'danger');
        console.log('error', error);
      }
    });
  }

  async delete(clientMembershipId: number){
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este ClientMembership?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.clientMembershipService.deleteClientMembership(clientMembershipId)
              .subscribe({
                next: () => {
                  this.getCliensMemberships();
                  this.presentToast('Se ha eliminado el ClientMembership exitosamente', 'success');
                },
                error: (error: any) => {
                  this.presentToast(`EError al borrar el ClientMembership: ${JSON.stringify(error.error)}`, 'danger');
                }
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async modalClientMembership(clientMembershipId?: number){
    const modal = await this.modalController.create({
      component: ModalClientMembershipComponent,
      componentProps: {
        clientMembershipId: clientMembershipId ? clientMembershipId : null,
      },
    });

    await modal.present()
    modal.onDidDismiss().then((data: any = false) => {
      if(data){
        this.getCliensMemberships();
      }
    });
  }

  presentToast(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

}
