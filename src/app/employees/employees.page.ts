import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';
import { AlertController } from '@ionic/angular/standalone';
import { ModalEmployeeComponent } from '../components/modal-employee/modal-employee.component';

@Component({
    selector: 'app-employees',
    templateUrl: './employees.page.html',
    styleUrls: ['./employees.page.scss'],
    standalone: true,
    imports: [
      IonicModule, 
      CommonModule,
    ]
  })
  export class EmployeesPage implements OnInit {

    employees: Employee[] = [];

    //Toast
    showToast = false;
    toastMessage = '';
    toastColor = 'success';

    constructor(
        private employeeeService: EmployeeService,
        private alertController: AlertController,
        private modalController: ModalController
    ) { }

    ngOnInit() {
        this.getEmployees();
    }

    getEmployees(){
        this.employeeeService.getEmployees().subscribe({
            next: (employees) => {
                this.employees = employees;
            },
            error: (error: any) => {
                this.presentToast('Error al obtener los empleados', error);
            }
        });
    }

    async delete(employeeId: number){
        const alert = await this.alertController.create({
            header: 'Confirmar Eliminación',
            message: '¿Estás seguro de que deseas eliminar este Empleado?',
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
                      this.employeeeService.deleteEmployee(employeeId)
                        .subscribe({
                          next: () => {
                            this.getEmployees();
                            this.presentToast('Se ha eliminado el empleado exitosamente', 'success');
                          },
                          error: (error: any) => {
                            this.presentToast(`Error al borrar el empleado: ${JSON.stringify(error.error)}`, 'danger');
                            console.log(error);
                          }
                      });
                    },
                },
            ],
        });

        await alert.present();
        
    }

    async modalEmployee(employeeId?: number){

        const modal = await this.modalController.create({
          component: ModalEmployeeComponent,
          componentProps: {
            employeeId: employeeId ? employeeId : null,
          },
        });
    
        await modal.present()
        modal.onDidDismiss().then((data: any = false) => {
          if(data){
            this.getEmployees();
          }
        });
    }

    presentToast(message: string, color: string) {
        this.toastMessage = message;
        this.toastColor = color;
        this.showToast = true;
      }

  }