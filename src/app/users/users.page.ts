import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { AlertController} from '@ionic/angular/standalone';
import { FormGroup} from '@angular/forms';
import { ModalUserComponent } from '../components/modal-user/modal-user.component';
import { ModalController, IonicModule } from '@ionic/angular';



@Component({
  selector: 'app-users',
  templateUrl: 'users.page.html',
  styleUrls: ['users.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule]
})
export class UsersPage implements OnInit{

  usersList?: User[];

  form: FormGroup;
  isForm: Promise<any>;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  isEditing = false;
  selectedUserId: number | null = null;

  constructor(
    private userService: UserService, 
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (resp: User[]) => {
        this.usersList = resp;
      },
      error: (error: any) => {
        console.log("error getting users", error);
      }
    });
  }

  async delete(userId: number){
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
                  this.userService.deleteUser(userId)
                    .subscribe({
                      next: () => {
                        this.getUsers();
                        this.presentToast('Se ha eliminado el usuario exitosamente', 'success');
                      },
                      error: (error: any) => {
                        this.presentToast(`Error al borrar el usuario: ${JSON.stringify(error.error)}`, 'danger');
                        console.log(error);
                      }
                  });
                },
            },
        ],
    });
    await alert.present();
}

  async modalUser(userId?: number){
    
    const modal = await this.modalController.create({
      component: ModalUserComponent,
      componentProps: {
        userId: userId ? userId : null,
      },
    });

    await modal.present()
    modal.onDidDismiss().then((data: any = false) => {
      if(data){
        this.getUsers();
      }
    });
  }

  presentToast(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
  
}
