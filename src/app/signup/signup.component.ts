import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MessageService } from '../message.service';
import { UserInfo } from '../constants/user';
import { usernameValidator, passwordLengthValidator, passwordMatchValidator } from '../util';

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
      username: new FormControl('by123', [Validators.required, usernameValidator]),
      password: new FormControl('123456', [Validators.required, passwordLengthValidator]),
      confirmPassword: new FormControl('123456', [Validators.required, passwordMatchValidator]),
      fullName: new FormControl('Bowen', Validators.required)
    });
  }

  ngOnInit() {
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
