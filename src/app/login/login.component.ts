import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

import { UserInfo } from '../constants/user';
import { Location } from '@angular/common';
import { MessageService } from '../message.service';

import { usernameLengthValidator, passwordLengthValidator } from '../util';

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
      username: new FormControl('', [Validators.required, usernameLengthValidator]),
      password: new FormControl('', [Validators.required, passwordLengthValidator])
    });
  }

  login(): void {
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
