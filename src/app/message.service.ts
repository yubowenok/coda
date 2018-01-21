import { Component, Injectable, Inject } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SECOND_MS } from './constants/time';
import { Router } from '@angular/router';

const INFO_DURATION = SECOND_MS * 3;
const ERROR_DURATION = SECOND_MS * 10;

@Component({
  selector: 'app-message-dialog',
  template: `
    <h1 mat-dialog-title *ngIf="data.title">{{data.title}}</h1>
    <div mat-dialog-content>
      {{data.msg}}
    </div>
    <div mat-dialog-actions class="float-right">
      <button mat-button (click)="onNoClick()" class="float-right">OK</button>
    </div>
  `,
})
export class MessageDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Injectable()
export class MessageService {

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) { }

  info(msg: string) {
    this.snackBar.open(msg, null, {
      duration: INFO_DURATION
    });
  }

  error(msg: string) {
    this.snackBar.open(`${msg}`, '×', {
      duration: ERROR_DURATION,
      panelClass: ['panel-error']
    });
  }

  infoDialog(msg: string, title?: string) {
    this.dialog.open(MessageDialogComponent, {
      width: '250px',
      data: {
        title: title,
        msg: msg
      }
    });
  }

  requireLogin() {
    const dialog = this.dialog.open(MessageDialogComponent, {
      width: '250px',
      data: {
        msg: 'This page requires login'
      }
    });
    dialog.afterClosed().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

}
