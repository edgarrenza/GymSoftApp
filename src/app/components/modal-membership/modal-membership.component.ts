import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular/standalone';
import { Membership } from 'src/app/models/membership';
import { MembershipService } from 'src/app/services/membership.service';

@Component({
  selector: 'app-modal-membership',
  templateUrl: './modal-membership.component.html',
  styleUrls: ['./modal-membership.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ],
})
export class ModalMembershipComponent implements OnInit {
  
  @Input() membershipId: number | null = null;
  form: FormGroup;
  title: string = '';

  // Toast properties
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private alertController: AlertController,
    private membershipService: MembershipService
  ) {}

  ngOnInit() {
    if (this.membershipId) {
      // Update
      this.title = 'Actualizar Membresia';
      this.membershipService.getMembershipById(this.membershipId)
        .subscribe({
          next: (membership) => {
            this.initFormUpdate(membership);
          },
          error: (error: any) => {
            this.presentToast(`Error al crear una membresia: ${JSON.stringify(error.error)}`, 'danger');
          }
        });
    } else {
      // Create
      this.title = 'Crear Membresia';
      this.initFormCreate();
    }
  }

  initFormCreate() {
    this.form = this.fb.group({
      type: ['', Validators.required],
      description: ['', Validators.required],
      cost: ['', Validators.required]
    });
  }

  initFormUpdate(membership: Membership) {
    this.form = this.fb.group({
      type: ['', Validators.required],
      description: ['', Validators.required],
      cost: ['', Validators.required],
      enabled: ['', Validators.required],
    });
    this.form.patchValue(membership);
  }

  create(){
    if(this.form.invalid){
        this.form.markAllAsTouched();
        this.presentToast('Error en el Formulario', 'danger');
        return;
    }

    this.membershipService.creareMembership(this.form.value)
    .subscribe({
        next: () => {
            this.form.reset();
            this.presentToast('Se ha creado la membresia exitosamente', 'success');
            this.closeModal(true)
        },
        error: (error: any) => {
            this.presentToast(`Error al crear la membresia: ${JSON.stringify(error.error)}`, 'danger');
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

        this.membershipService.updateMembership(this.membershipId!, this.form.value)
            .subscribe({
                next: () => {
                    this.form.reset();
                    this.presentToast('Se ha actualizado la membresia exitosamente', 'success');
                    this.closeModal(true)
                  },
                  error: (error: any) => {
                    this.presentToast(`Error al actualizar la membresia: ${JSON.stringify(error.error)}`, 'danger');
                    console.log(error);
                  }
            });
    }

  presentToast(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  isInvalid(ctrName: string) {
    const control = this.form.get(ctrName);
    return control?.touched && control?.errors;
  }

  closeModal(data?: boolean) {
    this.modalController.dismiss(data ? data : false);
  }
}
