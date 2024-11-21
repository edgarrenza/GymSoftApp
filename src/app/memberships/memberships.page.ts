import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular/standalone';
import { MembershipService } from '../services/membership.service';
import { Membership } from '../models/membership';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalMembershipComponent } from '../components/modal-membership/modal-membership.component';

@Component({
  selector: 'app-memberships',
  templateUrl: 'memberships.page.html',
  styleUrls: ['memberships.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ],
})
export class MembershipsPage implements OnInit {
  
  membershipsList?: Membership[];

  // Toast properties
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  constructor(
    private membershipService: MembershipService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.getMemberships();
  }

  getMemberships(): void {
    this.membershipService.getMemberships().subscribe({
      next: (memberships) => {
        this.membershipsList = memberships;
      },
      error: (error: any) => {
        this.presentToast('Error al obtener los ClientsMemberships', 'danger');
        console.log('error', error);
      }
    });
  }

  async delete(membershipId: number): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar esta membresia?',
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
            this.membershipService.deleteMembership(membershipId)
              .subscribe({
                next: () => {
                  this.getMemberships();
                  this.presentToast('Se ha eliminado la membresia exitosamente', 'success');
                },
                error: (error: any) => {
                  this.presentToast(`Error al borrar la membresia: ${JSON.stringify(error.error)}`, 'danger');
                  console.log(error);
                }
              });
          },
        },
      ],
    });

    await alert.present();
  }

  async modalMembership(membershipId?: number){
    const modal = await this.modalController.create({
      component: ModalMembershipComponent,
      componentProps: {
        membershipId: membershipId ? membershipId : null,
      },
    });

    await modal.present()
    modal.onDidDismiss().then((data: any = false) => {
      if(data){
        this.getMemberships();
      }
    });
  }

  presentToast(message: string, color: string): void {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}
