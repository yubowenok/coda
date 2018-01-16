import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MessageService } from '../message.service';
import { UserInfo } from '../constants/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private message: MessageService
  ) {
    this.form = fb.group({
      invitationCode: new FormControl('ABC', Validators.required),
      email: new FormControl('by123@nyu.edu', [Validators.required, Validators.email]),
      username: new FormControl('by123', [Validators.required, this.usernameValidator]),
      password: new FormControl('123456', [Validators.required, this.passwordLengthValidator]),
      confirmPassword: new FormControl('123456', [Validators.required, this.passwordMatchValidator]),
      fullName: new FormControl('Bowen', Validators.required)
    });
  }

  ngOnInit() {
  }

  usernameValidator(usernameControl: FormControl): ValidationErrors | null {
    if (!usernameControl.value.match(/^[a-z][a-z0-9_]*/) || usernameControl.value.length < 3) {
      return {
        error: { username: true }
      };
    }
    return null;
  }

  passwordLengthValidator(passwordControl: FormControl): ValidationErrors | null {
    if (passwordControl.value.length < 6) {
      return {
        error: { tooShort: true }
      };
    }
    return null;
  }

  passwordMatchValidator(confirmPasswordControl: FormControl): ValidationErrors | null {
    if (confirmPasswordControl.parent == null) {
      return null;
    }
    const passwordControl = confirmPasswordControl.parent.controls['password'];
    return passwordControl.value !== confirmPasswordControl.value ? {
      error: { notMatch: true }
    } : null;
  }

  signup() {
    this.api.signup(this.form.value)
      .subscribe((data: UserInfo | undefined) => {
        if (data === undefined) { // failure handler
          return;
        }
        this.message.info(`Welcome to coda, ${data.nickname}!`);
        this.router.navigate(['/']);
      });
  }

}
