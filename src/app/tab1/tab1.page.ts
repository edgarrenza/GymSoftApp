import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonGrid, IonCol, IonRow, IonIcon, IonButton, IonItem, 
  IonInput, IonText, IonCard, IonToast, AlertController } from '@ionic/angular/standalone';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { IonToggleValueAccessor } from '../directives/ion-toggle-value-accessor';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonRow, IonCol, IonGrid, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButton, ReactiveFormsModule, IonItem, IonInput, IonText, IonCard, FormsModule, IonToggleValueAccessor, IonToast],
})
export class Tab1Page  implements OnInit{

  usersList?: User[];
  form: FormGroup;
  isForm: Promise<any>;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  isEditing = false;
  selectedUserId: number | null = null;

  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService, 
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getUsers();
  }

  initForm() {
    this.isForm = Promise.resolve(
      (this.form = this.formBuilder.group({
        username: new FormControl(null,[Validators.required]),
        password: new FormControl(null, [Validators.required]),
        role: new FormControl(null, [Validators.required]),
        enabled: new FormControl(false),
      }))
    );
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (resp: User[]) => {
        console.log("getUsers resp", resp);
        this.usersList = resp;
      },
      error: (error: any) => {
        console.log("error getting users", error);
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

  // saveForm() {
  //   console.log("form:", this.form.value);
  //   if (this.form.valid) {
  //     this.userService.createUser(this.form.value).subscribe({
  //       next: async (resp: User) => {
  //         console.log("createUser resp", resp);
  //         this.form.reset();
  //         await this.presentToast('Usuario creado exitosamente', 'success');
  //         this.getUsers();
  //       },
  //       error: async (error: any) => {
  //         console.log("error creating user", error);
  //         await this.presentToast('Error al crear el usuario', 'danger');
  //       }
  //     });
  //   } else {
  //     console.log("Formulario inválido. Verifica los campos.");
  //     this.form.markAllAsTouched();
  //   }
  // }

  saveForm() {
    if (this.form.valid) {
      if (this.isEditing && this.selectedUserId !== null) {
        // Editar usuario existente
        this.userService.updateUser(this.selectedUserId, this.form.value).subscribe({
          next: async (resp: User) => {
            console.log('User updated:', resp);
            this.form.reset();
            this.isEditing = false;
            this.selectedUserId = null;
            await this.presentToast('Usuario actualizado exitosamente', 'success');
            this.getUsers();
          },
          error: async (error: any) => {
            console.error('Error updating user:', error);
            await this.presentToast('Error al actualizar el usuario', 'danger');
          },
        });
      } else {
        // Crear nuevo usuario
        this.userService.createUser(this.form.value).subscribe({
          next: async (resp: User) => {
            console.log('User created:', resp);
            this.form.reset();
            await this.presentToast('Usuario creado exitosamente', 'success');
            this.getUsers();
          },
          error: async (error: any) => {
            console.error('Error creating user:', error);
            await this.presentToast('Error al crear el usuario', 'danger');
          },
        });
      }
    } else {
      console.log('Formulario inválido. Verifica los campos.');
      this.form.markAllAsTouched();
    }
  }

  // resetForm() {
  //   this.form.reset({
  //     username: null,
  //     password: null,
  //     role: null,
  //     enabled: false,
  //   });

  //   this.form.get('enabled')?.setValue(false);
  //   this.form.get('enabled')?.markAsPristine();
  //   this.form.get('enabled')?.markAsUntouched();
  // }

  async presentToast(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  async confirmDeleteUser(userId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este usuario?',
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
            this.deleteUser(userId);
          },
        },
      ],
    });

    await alert.present();
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe({
      next: async () => {
        await this.presentToast('Usuario eliminado exitosamente', 'success');
        this.getUsers();
      },
      error: async (error: any) => {
        console.log('error deleting user', error);
        await this.presentToast('Error al eliminar el usuario', 'danger');
      },
    });
  }

  editUser(user: User) {
    this.isEditing = true;
    this.selectedUserId = user.userId;
    this.form.patchValue({
      username: user.username,
      password: user.password,
      role: user.role,
      enabled: user.enabled,
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedUserId = null;
    this.form.reset();
  }
}
