import { Component, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { SECOND_MS } from './constants/time';

const INFO_DURATION = SECOND_MS * 2;
const ERROR_DURATION = SECOND_MS * 4;

@Injectable()
export class MessageService {

  constructor(private snackBar: MatSnackBar) { }

  info(msg: string) {
    this.snackBar.open(msg, null, {
      duration: INFO_DURATION
    });
  }

  error(msg: string) {
    this.snackBar.open(`Error: ${msg}`, null, {
      duration: ERROR_DURATION,
      panelClass: ['panel-error']
    });
  }

}
