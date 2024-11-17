import { Component, OnInit } from '@angular/core';
import { MembershipService } from '../services/membership.service';
import { Membership } from '../models/membership';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonGrid, IonCol, IonRow, IonIcon, IonButton, IonItem, 
  IonInput, IonText, IonCard, IonToast, AlertController, IonSelect, IonSelectOption, IonToggle } from '@ionic/angular/standalone';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-memberships',
  templateUrl: 'memberships.page.html',
  styleUrls: ['memberships.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonRow, IonCol, IonGrid, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButton, ReactiveFormsModule, IonItem, IonInput, IonText, IonCard, FormsModule, IonToast,
    IonSelect, IonSelectOption, IonToggle],
})
export class MembershipsPage implements OnInit {

  membershipsList?: Membership[];
  form: FormGroup;
  isForm: Promise<any>;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  isEditing = false;
  selectedUserId: number | null = null;

  constructor(
    private formBuilder: FormBuilder, 
    private MembershipService: MembershipService, 
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    // this.initForm();
    this.getMemberships();
  }

  getMemberships() {
    this.MembershipService.getMemberships().subscribe({
      next: (resp: Membership[]) => {
        console.log("getMemberships resp", resp);
        this.membershipsList = resp;
      },
      error: (error: any) => {
        console.log("error getting memberships", error);
      }
    });
  }

  validateForm() {
    console.log("form:", this.form.value);
    if (this.form.valid) {
    } else {
      console.log("Formulario inválido. Verifica los campos.");
      this.form.markAllAsTouched();
    }
  }

  async confirmDeleteMembership(membershipId: number) {
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
            this.deleteMembership(membershipId);
          },
        },
      ],
    });

    await alert.present();
  }


  deleteMembership(membershipId: number) {
    this.MembershipService.deleteMembership(membershipId).subscribe({
      next: async () => {
        await this.presentToast('Membresia eliminada exitosamente', 'success');
        this.getMemberships();
      },
      error: async (error: any) => {
        console.log('error deleting membership', error);
        await this.presentToast('Error al eliminar la membresia', 'danger');
      },
    });
  }

  async presentToast(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  
}
