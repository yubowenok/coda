import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { passwordLengthValidator, passwordMatchValidator } from '../util';
import { ApiService } from '../api.service';
import { MessageService } from '../message.service';
import { UserSettings } from '../constants/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  password: FormGroup;
  settings: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private message: MessageService,
    private route: Router
  ) { }

  ngOnInit() {
    this.getUserSettings();

    this.password = this.fb.group({
      currentPassword: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, passwordLengthValidator]),
      confirmPassword: new FormControl('', [Validators.required, passwordMatchValidator])
    });
    this.settings = this.fb.group({
      fullName: new FormControl('', Validators.required),
      nickname: new FormControl('', Validators.required)
    });
  }

  getUserSettings() {
    this.api.getUserSettings()
      .subscribe((serverSettings: UserSettings | undefined) => {
        if (serverSettings === undefined) {
          // need login
          this.route.navigate(['/login']);
          return;
        }
        this.settings.setValue(serverSettings);
      });
  }

  updatePassword() {
    this.api.updatePassword(this.password.value)
      .subscribe(res => {
        if (res === true) {
          this.message.info('password updated');
        }
      });
  }

  updateSettings() {
    this.api.updateSettings(this.settings.value)
      .subscribe((serverSettings: UserSettings) => {
        this.message.info('settings updated');
      });
  }

}
