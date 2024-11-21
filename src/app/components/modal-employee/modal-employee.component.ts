import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonicModule, ModalController } from '@ionic/angular';
import { User } from "src/app/models/user";
import { AlertController } from '@ionic/angular/standalone';
import { UserService } from "src/app/services/user.service";
import { EmployeeService } from "src/app/services/employee.service";
import { Employee } from "src/app/models/employee";
import { forkJoin } from "rxjs";

@Component({
    selector: 'app-modal-employee',
    templateUrl: './modal-employee.component.html',
    styleUrls: ['./modal-employee.component.scss'],
    standalone: true,
    imports: [ CommonModule, ReactiveFormsModule, IonicModule ],
  })
  export class ModalEmployeeComponent  implements OnInit {

    @Input() employeeId: number | null = null;
    form: FormGroup;
    title: string = '';
    users: User[] = [];

    //Toast
    showToast = false;
    toastMessage = '';
    toastColor = 'success';

    constructor(
        private fb: FormBuilder,
        private modalController: ModalController,
        private alertController: AlertController,
        private userService: UserService,
        private employeeService: EmployeeService, 
      ) {}

    ngOnInit() {
        if(this.employeeId)
        {
            //update
            this.title = 'Actualizar Empleado';
            this.employeeService.getEmployeeById(this.employeeId)
                .subscribe({
                    next: (employee) => {
                        this.initFormUpdate(employee);
                    },
                    error: (error: any) => {
                        this.presentToast(`Error al crear el ClientMembership: ${JSON.stringify(error.error)}`, 'danger');
                    }
                })
        }else{
            this.title = 'Crear Empleado';
            this.getUsers();
            this.initFormCreate();
        }
    }

    initFormCreate(){
        this.form = this.fb.group({
          firstName: [null, Validators.required],
          lastName: [null, Validators.required],
          employeeType: [null, Validators.required],
          address: [null, Validators.required],
          email: ['', Validators.required],
          phone: ['', Validators.required],
          userId: ['', Validators.required]
        })
      }
    
      initFormUpdate(employee: Employee){
        this.form = this.fb.group({
          firstName: [null, Validators.required],
          lastName: [null, Validators.required],
          employeeType: [null, Validators.required],
          address: ['', Validators.required],
          email: ['', Validators.required],
          phone: ['', Validators.required],
          userId: ['', Validators.required],
          enabled: ['', Validators.required]
        });
        this.form.patchValue(employee);
    }

    getUsers() {
        forkJoin([
            this.userService.getUsers()
        ]).subscribe({
            next: ([users]) => {
                this.users = users;
            },
            error: (error: any) => {
                this.presentToast('Error al obtener los usuarios', 'danger');
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

        this.employeeService.creareEmployee(this.form.value)
            .subscribe({
                next: () => {
                    this.form.reset();
                    this.presentToast('Se ha creado el empleado exitosamente', 'success');
                    this.closeModal(true)
                },
                error: (error: any) => {
                    this.presentToast(`Error al crear el Empleado: ${JSON.stringify(error.error)}`, 'danger');
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

        this.employeeService.updateEmployee(this.employeeId!, this.form.value)
            .subscribe({
                next: () => {
                  this.form.reset();
                  this.presentToast('Se ha actualizado el empleado exitosamente', 'success');
                  this.closeModal(true)
                },
                error: (error: any) => {
                  this.presentToast('Error al actualizar el empleado', 'danger');
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