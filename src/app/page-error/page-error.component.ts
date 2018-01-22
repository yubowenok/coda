import {Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-error',
  templateUrl: './page-error.component.html',
  styleUrls: ['./page-error.component.css']
})
export class PageErrorComponent {

  @Input() msg: string;

  constructor() { }

}
