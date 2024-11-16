import { Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  standalone: true,
  selector: 'ion-toggle[formControlName], ion-toggle[formControl], ion-toggle[ngModel]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IonToggleValueAccessor,
      multi: true,
    },
  ],
})
export class IonToggleValueAccessor implements ControlValueAccessor {
  private onChange = (value: any) => {};
  private onTouched = () => {};

  // Método para escribir el valor inicial en el toggle
  writeValue(value: any): void {
    const toggle = document.querySelector('ion-toggle') as HTMLIonToggleElement;
    if (toggle) {
      toggle.checked = !!value;
    }
  }

  // Registrar el método de cambio
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registrar el método de touch
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Método para deshabilitar el toggle
  setDisabledState(isDisabled: boolean): void {
    const toggle = document.querySelector('ion-toggle') as HTMLIonToggleElement;
    if (toggle) {
      toggle.disabled = isDisabled;
    }
  }

  // Escuchar cambios en el toggle
  @HostListener('ionChange', ['$event'])
  handleChange(event: any): void {
    this.onChange(event.detail.checked);
    this.onTouched();
  }
}
