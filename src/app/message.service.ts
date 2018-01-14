import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { SECOND_MS } from './constants/time';

const MESSAGE_DURATION = SECOND_MS * 2;

@Injectable()
export class MessageService {

  constructor(private snackBar: MatSnackBar) { }

  showMessage(message: string, duration?: number) {
    duration = duration !== undefined ? duration : MESSAGE_DURATION;
    this.snackBar.open(message, null, {
      duration: duration
    });
  }

}
