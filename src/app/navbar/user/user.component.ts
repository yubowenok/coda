import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';

import { UserInfo } from '../../constants/user';
import { MessageService } from '../../message.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  constructor(
    private api: ApiService,
    private message: MessageService,
    private router: Router
  ) { }

  getUser(): UserInfo | undefined {
    return this.api.getCurrentUser();
  }

  logout() {
    this.api.logout()
      .subscribe();
  }
}
