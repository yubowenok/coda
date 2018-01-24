import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../message.service';
import { UserInfo } from '../constants/user';
import {
  passwordLengthValidator,
  passwordMatchValidator,
  usernameCharactersValidator,
  usernameLengthValidator
} from '../util';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  tooltip = {
    INVITATION_CODE: `An invitation code is required for signup.
    All enrolled students should have received an invitation code in your university mailbox.
    If you have enrolled but not yet received the code, please contact the instructor.
    If you are auditing the course, please contact the instructor to request a code.`,
    EMAIL: `Please use your netID email address like "abc123@nyu.edu".
    Do not use email alias like "albert.bobst.courant@nyu.edu"`
  };

  private form: FormGroup;
  private prefilledInvitationCode: string;

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private message: MessageService
  ) { }

  ngOnInit() {
    this.prefilledInvitationCode = this.route.snapshot.paramMap.get('invitationCode');

    this.form = this.fb.group({
      invitationCode: new FormControl({
        value: this.prefilledInvitationCode || '',
        disabled: this.prefilledInvitationCode
      }, Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [
        Validators.required,
        usernameCharactersValidator,
        usernameLengthValidator
      ]),
      password: new FormControl('', [Validators.required, passwordLengthValidator]),
      confirmPassword: new FormControl('', [Validators.required, passwordMatchValidator]),
      fullName: new FormControl('', Validators.required)
    });
  }

  signup() {
    const formValues = Object.assign({}, this.form.value,
      this.prefilledInvitationCode ? { invitationCode: this.prefilledInvitationCode } : {});
    console.log(formValues);
    this.api.signup(formValues)
      .subscribe(
        (data: UserInfo | undefined) => {
          if (data === undefined) { // failure handler
            return;
          }
          this.message.info(`Welcome to coda, ${data.nickname}!`);
          this.router.navigate(['/']);
        },
        err => {
          this.message.error(err.error.msg);
        }
      );
  }

}
