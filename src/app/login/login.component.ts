import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import * as Cookies from 'cookies-js';

import { UserInfo } from '../constants/user';
import { Location } from '@angular/common';
import { MessageService } from '../message.service';

import { nameLengthValidator, passwordLengthValidator } from '../util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    private location: Location,
    private message: MessageService
  ) {
    this.form = fb.group({
      username: new FormControl('', [Validators.required, nameLengthValidator]),
      password: new FormControl('', [Validators.required, passwordLengthValidator])
    });
  }

  login(): void {
    if (Cookies.get('lastUser')) {
      const lastUser = JSON.parse(Cookies.get('lastUser'));
      const username = this.form.value.username;
      if (username !== lastUser.username && username !== lastUser.email) {
        this.message.confirmDialog(
          'You attempt to login to a different account. Please confirm that your action complies with ' +
          'rules and policies. The instance will be recorded.',
          () => {
            this.api.loginSwitch(username, lastUser.username).subscribe();
            this.executeLogin();
          },
          'Warning'
        );
        return;
      }
    }
    this.executeLogin();
  }

  private executeLogin(): void {
    this.api.login(this.form.value)
      .subscribe(
        (data: UserInfo | undefined) => {
          if (data === undefined) { // failure handler
            return;
          }
          this.message.info(`Welcome back, ${data.nickname}!`);
          this.location.back();
        },
        err => {
          this.message.error(err.error.msg);
        }
      );
  }

}
