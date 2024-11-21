import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonicModule, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular/standalone';
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: 'app-modal-user',
    templateUrl: './modal-user.component.html',
    styleUrls: ['./modal-user.component.scss'],
    standalone: true,
    imports: [ CommonModule, ReactiveFormsModule, IonicModule ],
})
export class ModalUserComponent  implements OnInit {

    @Input() userId: number | null = null;
    form: FormGroup;
    title: string = '';

    //Toast
    showToast = false;
    toastMessage = '';
    toastColor = 'success';

    constructor(
        private fb: FormBuilder,
        private modalController: ModalController,
        private alertController: AlertController,
        private userService: UserService,
    ) {}

    ngOnInit() {
        if(this.userId){
            //update
            this.title = 'Actualizar usuario';
            this.userService.getUserById(this.userId)
                .subscribe({
                    next: (user) => {
                        this.initFormUpdate(user);
                    },
                    error: (error: any) => {
                        this.presentToast('Error al obtener el usuario', 'danger');
                    }
                })
        }else{
            this.title = 'Crear usuario';
            this.initFormCreate();
        }
    }

    initFormCreate(){
        this.form = this.fb.group({
          username: [null, Validators.required],
          password: [null, Validators.required],
          role: ['', Validators.required]
        })
      }
    
      initFormUpdate(user: User){
        this.form = this.fb.group({
            username: [null, Validators.required],
            password: [null, Validators.required],
            role: ['', Validators.required],
            enabled: ['', Validators.required]
        });
        this.form.patchValue(user);
    }

    create() {
        if (this.form.invalid) {
          this.form.markAllAsTouched();
          this.presentToast('Error en el Formulario', 'danger');
          return;
        }
      
        this.userService.createUser(this.form.value)
          .subscribe({
            next: () => {
              this.form.reset();
              this.presentToast('Se ha creado el usuario exitosamente', 'success');
              this.closeModal(true);
            },
            error: (error: any) => {
              const errorMessage = error?.error?.message || 'Error al crear el usuario';
              this.presentToast(`Error al crear el usuario: ${JSON.stringify(error.error)}`, 'danger');
            }
          });
      }
      

    update(){
        if(this.form.invalid){
            this.form.markAllAsTouched();
            this.presentToast('Error en el Formulario', 'danger');
            return;
        }

        this.userService.updateUser(this.userId!, this.form.value)
            .subscribe({
                next: () => {
                  this.form.reset();
                  this.presentToast('Se ha actualizado el usuario exitosamente', 'success');
                  this.closeModal(true)
                },
                error: (error: any) => {
                  this.presentToast(`Error al actualizar el usuario: ${JSON.stringify(error.error)}`, 'danger');
                  console.log(error);
                }
            });
    }

    presentToast(message: string, color: string) {
        this.toastMessage = message;
        this.toastColor = color;
        this.showToast = true;
    }
    
    isInvalid(ctrName: string){
        const control = this.form.get(ctrName);
        return control?.touched && control?.errors;
    }
    
    closeModal(data?: boolean) {
        this.modalController.dismiss(data ? data : false); // Cerrar el modal
    }

}