import { Injectable } from '@angular/core';
import { MessageService } from './message.service';

@Injectable()
export class CopyService {

  constructor(private message: MessageService) { }

  copyText(text: string, successMessage: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      this.message.showMessage(successMessage);
    } catch (err) {
      this.message.showMessage('copy is not supported by your browser');
    }
    document.body.removeChild(textArea);
  }
}
