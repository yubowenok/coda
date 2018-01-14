import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor() { }

  private username = 'by123@nyu.edu';

  ngOnInit() {
  }

  logout() {
    this.username = '';
  }
}