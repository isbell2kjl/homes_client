import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { StrongPasswordRegx } from 'src/app/helpers/constants';
import Validation from 'src/app/helpers/validators';
import { MyRecaptchaKey } from 'src/app/helpers/constants';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup;

  token: string = "";
  password: string = "";
  confirmPassword: string = "";
  siteKey = MyRecaptchaKey;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService,
    private location: Location, private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.resetPasswordForm = this.formBuilder.group({
      token: [null, Validators.required],
      password: [null, [Validators.required, Validators.pattern(StrongPasswordRegx)]],
      confirmPassword: [null, [Validators.required]],
    }, { validators: Validation.match('password', 'confirmPassword') }
    );

  }

  //reset the password by passing in the token from the email link along with the
  //password and confirmPassword values entered in the form.
  onSubmit() {
    if (!this.resetPasswordForm.valid) {
      window.alert('Please provide all the required values!');
    } else {
      //Validate the token provided in the email message sent.
      this.token = this.resetPasswordForm?.get('token')?.value;
      this.userService.validateResetToken(this.token).subscribe(response => {
        console.log(response)
        window.alert("Your token is valid");
        this.password = this.resetPasswordForm?.get('password')?.value;
        this.confirmPassword = this.resetPasswordForm?.get('confirmPassword')?.value;
        this.userService.resetPassword(this.token, this.password, this.confirmPassword).subscribe(response => {
          console.log(response)
          window.alert("Password reset successful, you can now login.");
          this.router.navigateByUrl('auth/signin');
        }, error => {
          console.log('Error: ', error)
          //generic error message for now.  Can implement more complex validation later.
          window.alert("Reset Error: Both fields must match");
        });
      }, error => {
        console.log('Error: ', error)
        window.alert("Your token is NOT valid! Reenter or Submit again.");
        if (error.status === 429 || error.status === 503) {
          window.alert("Too many failed attempts. Wait a few minutes and try again.");
        }
        // this.router.navigateByUrl('/forgot-password');
      });
    }
  }

  back(): void {
    this.location.back()
  }
}
