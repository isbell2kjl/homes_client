import { AbstractControl, ValidatorFn } from "@angular/forms";

export const baseURL: string = 'https://localhost:7279/api';
// export const baseURL: string = 'https://myproperties.ddns.net/api';

export const StrongPasswordRegx: RegExp =  
/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

export const EmailFormatRegx: RegExp =
/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;


export default class Validation {
    static match(controlName: string, checkControlName: string): ValidatorFn {
      return (controls: AbstractControl) => {
        const control = controls.get(controlName);
        const checkControl = controls.get(checkControlName);
  
        if (checkControl?.errors && !checkControl.errors['matching']) {
          return null;
        }
  
        if (control?.value !== checkControl?.value) {
          controls.get(checkControlName)?.setErrors({ matching: true });
          return { matching: true };
        } else {
          return null;
        }
      };
    }
  }