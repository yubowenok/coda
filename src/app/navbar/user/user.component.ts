import { Component } from '@angular/core';
import { ApiService } from '../../api.service';

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
    private message: MessageService
  ) { }

  getUser(): UserInfo | undefined {
    return this.api.getUser();
  }

  logout() {
    this.api.logout()
      .subscribe(res => {
        if (res === true) {
          this.message.info('logged out');
        }
      });
  }
}
