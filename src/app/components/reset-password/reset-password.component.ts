import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StrongPasswordRegx } from 'src/constants';
import Validation from 'src/constants';

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

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService,) { }

  ngOnInit() {

    this.resetPasswordForm = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.pattern(StrongPasswordRegx)]),
      confirmPassword: new FormControl(null, [Validators.required]),
    }, { validators: Validation.match('password', 'confirmPassword') }
    );


    this.token = this.route.snapshot.queryParams['token'];

    // remove token from url to prevent http referer leakage
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

    //validate token by comparing to ResetToken and checking ResetTokenExpires
    //values in the database.
    this.userService.validateResetToken(this.token).subscribe(response => {
      console.log(response)
      window.alert("Your token is valid, proceed to change your password.");
    }, error => {
      console.log('Error: ', error)
      window.alert("Your token is NOT valid");
      if (error.status === 401 || error.status === 403) {
        this.router.navigateByUrl('/forgot-password');
      }
    });
  }

  //reset the password by passing in the token from the email link along with the
  //password and confirmPassword values entered in the form.
  onSubmit() {
    if (!this.resetPasswordForm.valid) {
      window.alert('Please provide all the required values!');
    } else {
      this.password = this.resetPasswordForm?.get('password')?.value;
      // console.log(this.password);
      this.confirmPassword = this.resetPasswordForm?.get('confirmPassword')?.value;
      // console.log(this.confirmPassword);
      // console.log(this.token);
      this.userService.resetPassword(this.token, this.password, this.confirmPassword).subscribe(response => {
        console.log(response)
        window.alert("Password reset successful, you can now login.");
        this.router.navigateByUrl('auth/signin');
      }, error => {
        console.log('Error: ', error)
        //generic error message for now.  Can implement more complex validation later.
        window.alert("Reset Error: Both fields must match");
        if (error.status === 401 || error.status === 403) {
        }
      });
    }
  }
}
